'use client'
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import geoData from './korea.json';
import './camp_map.css';

function Page({ region, setRegion, setSelectedSigungu, setSigunguList, setKeyword, setHoveredRegion }) {
    const svgRef = useRef();
    const [mapContainer, setMapContainer] = useState(null);

    useEffect(() => {
        const width = 300;
        const height = 300;

        // SVG 컨테이너 생성
        const container = d3.select(svgRef.current)
            .attr('width', width)
            .attr('height', height);
        setMapContainer(container);

        const projection = d3.geoMercator()
            .fitSize([width, height], geoData);

        const path = d3.geoPath().projection(projection);

        // 기존 path 요소들 제거
        container.selectAll('path').remove();

        // 새로운 path 요소들 추가
        container.selectAll('path')
            .data(geoData.features)
            .join('path')
            .attr('d', path)
            .attr('fill', d => (region === d.properties.name ? '#5F8FF0' : 'white'))
            .attr('stroke', 'black')
            .attr('stroke-width', 0.5)
            .on('mouseover', function (event, d) {
                const name = d.properties.name;
                if (region !== name) {
                    d3.select(this).attr('fill', 'lightgray');
                }
                setHoveredRegion(name);
            })
            .on('mouseout', function (event, d) {
                if (region !== d.properties.name) {
                    d3.select(this).attr('fill', 'white');
                }
                setHoveredRegion('');
            })
            .on('click', function (event, d) {
                const selectedRegion = d.properties.name;
                setRegion(selectedRegion);
                setSelectedSigungu("");
                setSigunguList([]);
                setKeyword("");
                
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });

        return () => {
            container.selectAll('*').remove();
        };
    }, [region, setHoveredRegion]);

    return (
        <div className="map-wrapper">
            <svg ref={svgRef}></svg>
        </div>
    );
}

export default Page;
