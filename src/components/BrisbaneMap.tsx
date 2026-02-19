import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useNavigate } from 'react-router-dom';

const BrisbaneMap: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 600;
    const height = 400;
    const svg = d3.select(svgRef.current)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .style('width', '100%')
      .style('height', 'auto');

    svg.selectAll('*').remove();

    // Stylized Brisbane Regions
    const regions = [
      { id: 'north', name: 'North Brisbane', path: 'M 300 50 L 500 50 L 550 150 L 300 200 Z', color: '#f59e0b' },
      { id: 'south', name: 'South Brisbane', path: 'M 300 200 L 550 250 L 500 350 L 300 350 Z', color: '#fbbf24' },
      { id: 'west', name: 'West Brisbane', path: 'M 50 100 L 300 50 L 300 200 L 100 250 Z', color: '#d97706' },
      { id: 'east', name: 'East Brisbane', path: 'M 300 200 L 550 150 L 580 250 L 550 300 Z', color: '#fcd34d' },
      { id: 'central', name: 'CBD & Central', path: 'M 250 150 L 350 150 L 350 250 L 250 250 Z', color: '#b45309' },
    ];

    const g = svg.append('g');

    // Draw regions
    g.selectAll('path')
      .data(regions)
      .enter()
      .append('path')
      .attr('d', d => d.path)
      .attr('fill', d => d.color)
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)
      .attr('class', 'cursor-pointer transition-all duration-300 hover:opacity-80')
      .on('mouseover', function(event, d) {
        d3.select(this).attr('filter', 'brightness(1.1)');
        tooltip.transition().duration(200).style('opacity', .9);
        tooltip.html(d.name)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseout', function() {
        d3.select(this).attr('filter', null);
        tooltip.transition().duration(500).style('opacity', 0);
      })
      .on('click', (event, d) => {
        // Find a suburb in this region to navigate to
        const suburb = d.id === 'central' ? 'brisbane-cbd' : 
                       d.id === 'north' ? 'chermside' :
                       d.id === 'south' ? 'sunnybank' :
                       d.id === 'west' ? 'indooroopilly' : 'carindale';
        navigate(`/suburb/${suburb}`);
      });

    // Add labels
    g.selectAll('text')
      .data(regions)
      .enter()
      .append('text')
      .attr('x', d => {
        const bbox = (svg.select(`path[fill="${d.color}"]`).node() as SVGPathElement).getBBox();
        return bbox.x + bbox.width / 2;
      })
      .attr('y', d => {
        const bbox = (svg.select(`path[fill="${d.color}"]`).node() as SVGPathElement).getBBox();
        return bbox.y + bbox.height / 2;
      })
      .attr('text-anchor', 'middle')
      .attr('fill', '#fff')
      .attr('font-size', '12px')
      .attr('font-weight', 'bold')
      .attr('pointer-events', 'none')
      .text(d => d.name);

    // Tooltip
    const tooltip = d3.select('body').append('div')
      .attr('class', 'absolute opacity-0 bg-slate-900 text-white px-3 py-1 rounded text-xs font-bold pointer-events-none z-50 shadow-xl');

    return () => {
      tooltip.remove();
    };
  }, [navigate]);

  return (
    <div className="relative bg-slate-50 rounded-3xl p-8 border border-slate-200 shadow-inner overflow-hidden">
      <div className="absolute top-4 left-4 z-10">
        <h4 className="text-slate-900 font-bold text-lg">Interactive Service Map</h4>
        <p className="text-slate-500 text-xs">Click a region to see local coverage</p>
      </div>
      <svg ref={svgRef} className="w-full h-auto drop-shadow-2xl" />
    </div>
  );
};

export default BrisbaneMap;
