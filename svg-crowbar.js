d3.select("body")
  .append("a")
    .attr("id", "download-svg")
    .attr("href", "#")
    .attr("target", "_blank")
    .attr("download", "untitled.svg")
    .style("margin-top", "10px")
  .append("button")
    .text("Save as SVG")
    .style("display", "block");

d3.select("#download-svg")
    .on("mouseover", function() {
      var doctype = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';
      var svgNode = d3.select("svg")
          .attr("xmlns", d3.ns.prefix.svg)
          .attr("version", "1.1");
      svgNode.insert("defs", ":first-child")
        .append("style");
      var filename = "Untitled";
      var styles = "";
      d3.selectAll("style").each(function() {
        var n = d3.select(this);
        if (n !== undefined && n.html() !== undefined ) {
          styles += n.html();
        }
      }).html();
      var svg = (new XMLSerializer()).serializeToString(svgNode[0][0]);
      svg = svg.replace('<style></style>', '<style type="text/css"><![CDATA[' + styles + ']]></style>');
      var svgSource = [doctype + svg];
      this.href = URL.createObjectURL(new Blob(svgSource, { "type" : "text\/xml" }));
    })
    .on("mouseout", function() {
      setTimeout(function() {
        URL.revokeObjectURL(this.href);
      }, 10);
    });