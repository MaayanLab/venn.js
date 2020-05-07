import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import * as venn from 'venn.js';

/**
 * VennDiagram is a react component for venn.js
 * 
 * Usage:
 *  <VennDiagram
 *    width={600}
 *    height={600}
 *    sets={[
 *      {sets: ['A'], size: 12},
        {sets: ['B'], size: 12},
        {sets: ['A','B'], size: 2},
 *    ]}
 *    tooltip={(datum, ind) => `${JSON.stringify(datum)}`}
 *    onClick={(datum, ind) => console.log(`(${JSON.stringify(datum)}, ${ind})`)}
 *  />
 */
class VennDiagram extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.componentRefChanged = this.componentRefChanged.bind(this);
    this.componentReady = this.componentReady.bind(this);
  }

  componentRefChanged(ref) {
    if (ref) {
      this.ref = ref;
      this.componentReady();
    }
  }

  componentDidUpdate() {
    this.componentReady();
  }

  componentReady() {
    const self = this;
    let { sets, tooltip, onClick, width, height } = self.props;

    if (width === undefined) width = 500;
    if (height === undefined) height = 400;

    if (self.chart === undefined) {
      self.chart = venn.VennDiagram();
    }
    self.chart
      .width(width)
      .height(height);

    const div = d3.select(self.ref)
      .datum(sets)
      .call(self.chart);

    d3.select(self.ref)
      .select('svg')
      .style('display', 'inline-block')
      .style('position', 'absolute')
      .style('top', '10px')
      .style('left', '0')
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', '100%')
      .attr('height', '100%');

    div.selectAll("path")
      .style("stroke-opacity", 0)
      .style("stroke", "#fff")
      .style("stroke-width", 3);

    div.selectAll("g")
      .on("mouseover", function(d, i) {
        // sort all the areas relative to the current item
        venn.sortAreas(div, d);
      });

    if (onClick !== undefined) {
      div.selectAll("g")
        .on("click", function (d, i) {
          onClick(d, i);
        });
    }

    if (tooltip !== undefined) {
      if (self.tooltipEl === undefined) {
        self.tooltipEl = d3.select(self.ref)
          .append("div")
          .style('display', 'block')
          .style('position', 'absolute')
          .style('text-align', 'center')
          .style('width', '128px')
          .style('height', '16px')
          .style('background', '#333')
          .style('color', '#ddd')
          .style('padding', '2px')
          .style('border', '0px')
          .style('border-radius', '8px')
          .style('opacity', '0');
      }
      div.selectAll("g")
        .on("mouseover", function (d, i) {
          // Display a tooltip with the current size
          self.tooltipEl.transition().duration(400).style("opacity", .9);
          self.tooltipEl.text(tooltip(d, i));
          // highlight the current path
          let selection = d3.select(this).transition("tooltip").duration(400);
          selection.select("path")
            .style("fill-opacity", d.sets.length == 1 ? .4 : .1)
            .style("stroke-opacity", 1);
        })
        .on("mousemove", function() {
          self.tooltipEl.style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d, i) {
          self.tooltipEl.transition().duration(400).style("opacity", 0);
          let selection = d3.select(this).transition("tooltip").duration(400);
          selection.select("path")
            .style("fill-opacity", d.sets.length == 1 ? .25 : .0)
            .style("stroke-opacity", 0);
        });
    }
  }

  render() {
    return (
      <div
        ref={this.componentRefChanged}
        style={{
          display: 'inline-block',
          position: 'relative',
          width: '100%',
          paddingBottom: '100%',
          verticalAlign: 'top',
          overflow: 'hidden'
        }}
      />
    );
  }
}

VennDiagram.propTypes = {
  /**
   * sets: The sets to show in the diagram, each area is defined independently
   * sets={[
   *   {sets: ['A'], size: 12},
   *   {sets: ['B'], size: 12},
   *   {sets: ['A','B'], size: 2},
   * ]}
   */
  sets: PropTypes.arrayOf(
    PropTypes.shape({
      sets: PropTypes.arrayOf(PropTypes.string),
      size: PropTypes.number,
    })
  ).isRequired,
  /**
   * tooltip: A function to transform (datum, ind) into a serialized tooltip
   * (set_data, set_index) => string
   */
  tooltip: PropTypes.func,
  /**
   * onClick: A function which responds to click events with (datum, ind)
   * (set_data, set_index) => void
   */
  onClick: PropTypes.func,
  /**
   * width of canvas in svg viewBox
   */
  width: PropTypes.number,
  /**
   * height of canvas in svg viewBox
   */
  height: PropTypes.number,
};

export default VennDiagram;