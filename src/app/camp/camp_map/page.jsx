'use client'
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import geoData from './korea.json';
import './camp_map.css';

function Page({ region, setRegion, setSelectedSigungu, setSigunguList, setKeyword }) {
    const svgRef = useRef();
    const tooltipRef = useRef();

    useEffect(() => {
        const width = 300;
        const height = 300;

        // Select the SVG element and set its dimensions
        const svg = d3.select(svgRef.current)
            .attr('width', width)
            .attr('height', height);

        // Create a tooltip element
        const tooltip = d3.select(tooltipRef.current)
            .style('position', 'absolute')
            .style('background', 'white')
            .style('border', '1px solid black')
            .style('padding', '5px')
            .style('border-radius', '5px')
            .style('visibility', 'hidden');

        // Define a projection and path generator
        const projection = d3.geoMercator()
            .fitSize([width, height], geoData);

        const path = d3.geoPath().projection(projection);

        // Draw the map
        svg.selectAll('path')
            .data(geoData.features)
            .join('path')
            .attr('d', path)
            .attr('fill', d => (region === d.properties.name ? '#5F8FF0' : 'white')) // 선택된 지역 강조
            .attr('stroke', 'black')
            .attr('stroke-width', 0.5)
            .on('mouseover', function (event, d) {
                if (region !== d.properties.name) {
                    d3.select(this).attr('fill', 'lightgray');
                }
                tooltip
                    .style('visibility', 'visible')
                    .text(d.properties.name);
            })
            .on('mousemove', function (event) {
                tooltip
                    .style('top', `${event.pageY + 10}px`)
                    .style('left', `${event.pageX + 10}px`);
            })
            .on('mouseout', function (event, d) {
                if (region !== d.properties.name) {
                    d3.select(this).attr('fill', 'white');
                }
                tooltip.style('visibility', 'hidden');
            })
            .on('click', function (event, d) {
                const selectedRegion = d.properties.name;
                setRegion(selectedRegion);
                setSelectedSigungu("");
                setSigunguList([]);
                setKeyword("");
            });
    }, [region]);

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        svg.selectAll('path')
            .attr('fill', d => (region === d.properties.name ? '#5F8FF0' : 'white')); // 선택된 지역 강조
    }, [region]);

    return (
        <>
            <svg ref={svgRef}></svg>
            <div ref={tooltipRef}></div>
            <p>{region ? `선택 지역 : ${region}` : '지역을 선택하세요!'}</p>
        </>
    );
}

export default Page;
