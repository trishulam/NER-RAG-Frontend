"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import ForceGraph2D from "react-force-graph-2d";
import InfoPanel from "@/components/InfoPanel";
import LinkInfoPanel from "@/components/LinkInfoPanel";
import Loader from "@/components/Loader";
import Legend from "@/components/Legend";
import { RelationshipTypeSelector } from "@/components/RelationshipTypeSelector";
import { TextInputModal } from "@/components/TextInputModal";
import { GraphList } from "@/components/GraphList";
import { NODE_COLORS, LINK_COLORS, SELECTED_LINK_COLOR, ANAMOLY_COLOR } from "./styles/colors";
import { Button } from "@/components/ui/button";
import { ZoomIn, Settings, Upload, List, Waypoints } from "lucide-react";
import axios from "axios";

interface GraphData {
  nodes: any[];
  links: any[];
}

interface GraphList {
  id: string;
  title: string;
}

export default function Home() {
  const [textLoading, setTextLoading] = useState(false);
  const [graphData, setGraphData] = useState<GraphData>({
    nodes: [],
    links: [],
  });
  const [inputText, setInputText] = useState("");
  const [graphDatasets, setGraphDatasets] = useState<Record<string, GraphData>>(
    {}
  );
  const [selectedElement, setSelectedElement] = useState<any>(null);
  const [selectedRelationshipTypes, setSelectedRelationshipTypes] = useState<
    string[]
  >([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showTextModal, setShowTextModal] = useState(false);
  const [showGraphList, setShowGraphList] = useState(false);
  const [filteredLinks, setFilteredLinks] = useState<any[]>([]);
  const forceGraphRef = useRef<any>();
  const [loading, setLoading] = useState(true);
  const [graphList, setGraphList] = useState<GraphList[]>([]);

  const getFilteredLinks = useCallback(() => {
    return graphData.links.filter((link) => {
      const relationType = link.properties.relationship_type
        .split("_")
        .slice(0, -1)
        .join("_");
      return (
        selectedRelationshipTypes.length === 0 ||
        selectedRelationshipTypes.includes(relationType)
      );
    });
  }, [selectedRelationshipTypes, graphData.links]);

  function transformData(backendData) {
    const transformedData = [];

    // Helper function to map plural to singular keys
    const singularKey = (key) => {
      const keyMapping = {
        persons: "person",
        vehicles: "vehicle",
        locations: "location",
        events: "event",
        emails: "email",
        phone_numbers: "phone",
      };
      return keyMapping[key] || key;
    };

    // Helper function to transform each item
    const transformItem = (key, item) => {
      const singular = singularKey(key);

      // Special handling for vehicles
      const label =
        singular === "vehicle" && item.license_plate
          ? item.license_plate
          : item.value;

      return {
        id: `${singular}-${item.id}`,
        label: label,
        type: singular,
        properties: { ...item },
      };
    };

    // Process each key in the backend data
    for (const key in backendData) {
      if (Array.isArray(backendData[key])) {
        backendData[key].forEach((item) => {
          transformedData.push(transformItem(key, item));
        });
      }
    }

    return transformedData;
  }

  function transformEdges(backendEdges) {
    console.log({ backendEdges });  
    return backendEdges.map((edge) => ({
      id: `edge-${edge.id}`,
      source: `${resolveType(edge.relationship_type.split("_")[0])}-${
        edge.source_id
      }`,
      target: `${resolveType(edge.relationship_type.split("_")[2])}-${
        edge.target_id
      }`,
      label: edge.type,
      properties: {
        id: edge.id,
        note: edge.note,
        relationship_type: edge.relationship_type,
        type: edge.type,
      },
    }));
  }

  // Helper function to map relationship type to the appropriate prefix
  function resolveType(type) {
    const typeMapping = {
      person: "person",
      event: "event",
      vehicle: "vehicle",
      location: "location",
      email: "email",
      phone: "phone",
    };
    return typeMapping[type] || type;
  }

  
  async function fetchAll() {
    try {
      const entitiesResponse = await axios.get(
        `http://localhost:8080/get_entities`
      );
      const transformedNodes = transformData(entitiesResponse.data);

      const relationsResponse = await axios.get(
        `http://localhost:8080/get_relations`
      );
      const transformedEdges = transformEdges(relationsResponse.data);

      setGraphData({ nodes: transformedNodes, links: transformedEdges });
    } catch (error) {
      console.log(error);
      return { nodes: [], links: [] }; // Return empty data in case of error
    }
  }

  const handleSelectGraph = useCallback(
    (id: string) => {
      console.log("Selected graph:", id);
      console.log({ graphDatasets });

      if (graphDatasets && graphDatasets[id]) {
        console.log("Graph data:", graphDatasets[id]);
        setGraphData(graphDatasets[id]);
      } else {
        console.warn(`Graph with ID ${id} not found in graphDatasets`);
      }

      setSelectedRelationshipTypes([]); // Reset selected relationship types when changing graphs
      setShowGraphList(false);
    },
    [graphDatasets]
  );

  useEffect(() => {
    async function fetchGraphList() {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:8080/get_all_inputs"
        );
        const transformedData = response.data.map((item: any) => ({
          id: item.id.toString(), 
          title:
            item.input_text.length > 30
              ? `${item.input_text.substring(0, 30)}...`
              : item.input_text, 
        }));
        setGraphList(transformedData);
        console.log({ transformedData });

        await fetchAllGraphs(transformedData);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    }

    async function fetchGraph(item_id: string) {
      try {
        const entitiesResponse = await axios.get(
          `http://localhost:8080/get_entities/${item_id}`
        );
        const transformedNodes = transformData(entitiesResponse.data);

        const relationsResponse = await axios.get(
          `http://localhost:8080/get_relations/${item_id}`
        );
        const transformedEdges = transformEdges(relationsResponse.data);

        return {
          nodes: transformedNodes,
          links: transformedEdges,
        };
      } catch (error) {
        console.log(error);
        return { nodes: [], links: [] }; // Return empty data in case of error
      }
    }

    async function fetchAllGraphs(graphList: GraphList[]) {
      
      try {
        const datasets = await Promise.all(
          graphList.map(async (item) => {
            const graph = await fetchGraph(item.id);
            return { [item.id]: graph };
          })
        );

        // Merge all datasets into a single object
        const mergedDatasets = datasets.reduce(
          (acc, dataset) => ({ ...acc, ...dataset }),
          {}
        );

        console.log({ mergedDatasets });
        setGraphDatasets(mergedDatasets);
        console.log({ graphDatasets });
      } catch (error) {
        console.log(error);
      }
    }

    fetchGraphList();
  }, [textLoading]);

  useEffect(() => {
    // Once we have the graphList and graphDatasets populated, 
    // if there's at least one graph, select the first one.
    if (graphList.length > 0 && Object.keys(graphDatasets).length > 0) {
      handleSelectGraph(graphList[graphList.length - 1].id);
    }
  }, [graphList, graphDatasets, handleSelectGraph]);

  useEffect(() => {
    setFilteredLinks(getFilteredLinks());
  }, [getFilteredLinks, graphData]);

  const handleNodeClick = useCallback((node: any) => {
    setSelectedElement({ type: "node", data: node });
  }, []);

  const handleLinkClick = useCallback((link: any) => {
    setSelectedElement({ type: "link", data: link });
  }, []);

  const nodeCanvasObject = useCallback(
    (node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
      const label = node.label;
      const fontSize = 12 / globalScale;
      ctx.font = `${fontSize}px Inter, sans-serif`;
      const textWidth = ctx.measureText(label).width;
      const bckgDimensions = [textWidth, fontSize].map(
        (n) => n + fontSize * 0.2
      );
  
      // Check if the node has any relations
      const hasRelations = graphData.links.some(
        link => link.source.id === node.id || link.target.id === node.id
      );
  
      // Node circle
      ctx.fillStyle = NODE_COLORS[node.type as keyof typeof NODE_COLORS];
      ctx.beginPath();
      ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI);
      ctx.fill();
  
      // Node border
      ctx.strokeStyle = hasRelations ? "white" : ANAMOLY_COLOR;
      ctx.lineWidth = 1.5;
      ctx.stroke();
  
      // Node label
      ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label, node.x, node.y + 10);
  
      node.__bckgDimensions = bckgDimensions;
    },
    [graphData.links]
  );

  const linkColor = useCallback(
    (link: any) => {
      if (
        selectedElement &&
        selectedElement.type === "link" &&
        selectedElement.data.id === link.id
      ) {
        return SELECTED_LINK_COLOR;
      }
      const relationType = link.properties.relationship_type
        .split("_")
        .slice(0, -1)
        .join("_");
      return LINK_COLORS[relationType as keyof typeof LINK_COLORS] || "#94A3B8";
    },
    [selectedElement]
  );

  const linkWidth = useCallback(
    (link: any) => {
      if (
        selectedElement &&
        selectedElement.type === "link" &&
        selectedElement.data.id === link.id
      ) {
        return 4; // Thicker width for selected link
      }
      return 2;
    },
    [selectedElement]
  );

  const handleRealign = useCallback(() => {
    if (forceGraphRef.current) {
      forceGraphRef.current.zoomToFit(400, 50);
    }
  }, []);

  const handleTextSubmit = async (text: string, provider: string) => {
    setTextLoading(true);
    console.log("Submitted text:", text);
    setInputText(text);
    await axios.post("http://localhost:8080/parse_entities", { 
      user_message: text,
      provider : provider
     })
    .then(async (entitiesResponse) => { 
      console.log(entitiesResponse.data);
      await axios.post("http://localhost:8080/parse_relations", { 
        input_text_id : entitiesResponse.data.input_text_id,
        provider : provider
       })
      .then(async () => {setTextLoading(false);})
      })
  };

    // Custom force to position emails and phone numbers
    const customForce = useCallback(() => {
      const nodes = graphData.nodes
      const events = nodes.filter(node => node.type === 'event')
      const emails = nodes.filter(node => node.type === 'email')
      const phoneNumbers = nodes.filter(node => node.type === 'phone')

      if (events.length === 0) return

      // Position emails near events
      emails.forEach((email, index) => {
      const event = events[index % events.length]
      if (event && event.x != null && event.y != null) {
        email.fx = event.x + 50
        email.fy = event.y - 50 - (index * 30) // Add vertical spacing of 30 units between emails
      }
      })

      // Position phone numbers near events with spacing
      phoneNumbers.forEach((phone, index) => {
      const event = events[index % events.length]
      if (event && event.x != null && event.y != null) {
        phone.fx = event.x - 50
        phone.fy = event.y - 50 - (index * 30) // Add vertical spacing of 30 units between phones
      }
      })
    }, [graphData.nodes])
  
    useEffect(() => {
      if (forceGraphRef.current) {
        forceGraphRef.current.d3Force('custom', customForce)
      }
    }, [customForce])

  if (loading || textLoading) {
    return <Loader />;
  }

  return (
    <div className="w-screen h-screen relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-200">
      <div className="absolute top-4 left-4 z-10 flex flex-col space-y-4">
        <div className="flex space-x-2">
          <Button
            onClick={handleRealign}
            variant="outline"
            size="sm"
            className="bg-white text-gray-700 hover:bg-gray-100"
          >
            <ZoomIn className="w-4 h-4 mr-2" /> Fit View
          </Button>
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            size="sm"
            className="bg-white text-gray-700 hover:bg-gray-100"
          >
            <Settings className="w-4 h-4 mr-2" /> Filters
          </Button>
          <Button
            onClick={() => setShowTextModal(true)}
            variant="outline"
            size="sm"
            className="bg-white text-gray-700 hover:bg-gray-100"
          >
            <Upload className="w-4 h-4 mr-2" /> Upload Text
          </Button>
          <Button
            onClick={() => setShowGraphList(!showGraphList)}
            variant="outline"
            size="sm"
            className="bg-white text-gray-700 hover:bg-gray-100"
          >
            <List className="w-4 h-4 mr-2" /> View Graphs
          </Button>
          <Button
            onClick={fetchAll}
            variant="outline"
            size="sm"
            className="bg-white text-gray-700 hover:bg-gray-100"
          >
            <Waypoints className="w-4 h-4 mr-2" /> View All Graphs
          </Button>
        </div>
        {showFilters && (
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <RelationshipTypeSelector
              selectedTypes={selectedRelationshipTypes}
              onChange={setSelectedRelationshipTypes}
            />
          </div>
        )}
        {showGraphList && (
          <GraphList graphs={graphList} onSelectGraph={handleSelectGraph} />
        )}
      </div>
      <div className="absolute top-4 right-4 z-10">
        <Legend />
      </div>
      <ForceGraph2D
        ref={forceGraphRef}
        graphData={{
          nodes: graphData.nodes,
          links: filteredLinks,
        }}
        nodeCanvasObject={nodeCanvasObject}
        linkColor={linkColor}
        linkWidth={linkWidth}
        linkDirectionalParticles={2}
        linkDirectionalParticleSpeed={0.005}
        linkDirectionalParticleWidth={5}
        linkDirectionalArrowLength={3}
        linkDirectionalArrowRelPos={0.5}
        onNodeClick={handleNodeClick}
        onLinkClick={handleLinkClick}
        d3VelocityDecay={0.3}
        cooldownTicks={100}
        nodeRelSize={6}
        enableNodeDrag={true}
        enableZoomInteraction={true}
        enablePanInteraction={true}
        width={window.innerWidth}
        height={window.innerHeight}
      />
      {selectedElement && selectedElement.type === "node" && (
        <InfoPanel
          element={selectedElement}
          onClose={() => setSelectedElement(null)}
        />
      )}
      {selectedElement && selectedElement.type === "link" && (
        <LinkInfoPanel
          link={selectedElement.data}
          onClose={() => setSelectedElement(null)}
        />
      )}
      <TextInputModal
        isOpen={showTextModal}
        onClose={() => setShowTextModal(false)}
        onSubmit={handleTextSubmit}
      />
    </div>
  );
}
