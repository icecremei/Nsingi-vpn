
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { VPNServer } from '../types';

interface WorldMapProps {
  servers: VPNServer[];
  selectedServer: VPNServer;
  onSelectServer: (server: VPNServer) => void;
  isConnected: boolean;
}

const WorldMap: React.FC<WorldMapProps> = ({ servers, selectedServer, onSelectServer, isConnected }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 800;
    const height = 450;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const projection = d3.geoMercator()
      .scale(120)
      .translate([width / 2, height / 1.5]);

    const path = d3.geoPath().projection(projection);

    // Draw world map
    d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson")
      .then((data: any) => {
        svg.append("g")
          .selectAll("path")
          .data(data.features)
          .enter()
          .append("path")
          .attr("d", path)
          .attr("fill", "#111111")
          .attr("stroke", "#333333")
          .attr("stroke-width", 0.5);

        // Draw connections if connected
        if (isConnected) {
            const userLocation: [number, number] = [0, 20]; // Mock user at equator/prime meridian
            const start = projection(userLocation);
            const end = projection([selectedServer.coordinates[1], selectedServer.coordinates[0]]);
            
            if (start && end) {
                svg.append("path")
                    .attr("d", `M${start[0]},${start[1]} Q${(start[0]+end[0])/2},${(start[1]+end[1])/2 - 50} ${end[0]},${end[1]}`)
                    .attr("stroke", "#EF4444")
                    .attr("stroke-width", 2)
                    .attr("fill", "none")
                    .attr("stroke-dasharray", "5,5")
                    .append("animate")
                    .attr("attributeName", "stroke-dashoffset")
                    .attr("from", "100")
                    .attr("to", "0")
                    .attr("dur", "3s")
                    .attr("repeatCount", "indefinite");
            }
        }

        // Draw servers
        svg.selectAll("circle")
          .data(servers)
          .enter()
          .append("circle")
          .attr("cx", d => projection([d.coordinates[1], d.coordinates[0]])?.[0] || 0)
          .attr("cy", d => projection([d.coordinates[1], d.coordinates[0]])?.[1] || 0)
          .attr("r", d => d.id === selectedServer.id ? 6 : 3)
          .attr("fill", d => d.id === selectedServer.id ? "#EF4444" : "#444444")
          .attr("class", "cursor-pointer transition-all hover:r-8 hover:fill-red-500")
          .on("click", (event, d) => onSelectServer(d));
          
        // Add glow to selected server
        if (selectedServer) {
            const coords = projection([selectedServer.coordinates[1], selectedServer.coordinates[0]]);
            if (coords) {
                svg.append("circle")
                    .attr("cx", coords[0])
                    .attr("cy", coords[1])
                    .attr("r", 12)
                    .attr("fill", "rgba(239, 68, 68, 0.2)")
                    .attr("class", "animate-pulse");
            }
        }
      });
  }, [servers, selectedServer, isConnected, onSelectServer]);

  return (
    <div className="w-full h-full overflow-hidden bg-black rounded-xl border border-zinc-800 p-4 relative group">
      <div className="absolute top-4 left-4 z-10">
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Global Network</h3>
      </div>
      <svg ref={svgRef} viewBox="0 0 800 450" className="w-full h-full" />
    </div>
  );
};

export default WorldMap;
