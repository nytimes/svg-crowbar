var SVGCrowbar = {

  init: function(filename, selector) {

    var title = filename ? filename : "untitled",
        svg = d3.select(selector ? selector : "svg"),
        parent = d3.select("body"),
        doctype = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';

    var link = parent.append("a")
        .attr("href", "#")
        .attr("class", "svg-crowbar")
        .attr("target", "_blank")
        .attr("download", title + ".svg")
        .style("width", "250px")
        .style("font-size", "16px")
        .style("display", "inline-block")
        .style("text-align", "center")
        .style("border-radius", "3px")
        .style("padding", "6px")
        .style("color", "white")
        .style("background", "#004276")
        .style("margin", "10px 10px 0 0")
        .text("Download " + title + ".svg")

    link.on("mouseover", function() {
      var styles = "",
          styleSheets = window.document.styleSheets,
          link = d3.select(this);

      svg.attr("xmlns", d3.ns.prefix.svg)
          .attr("version", "1.1")
        .insert("defs", ":first-child")
        .append("style")
          .attr("type", "text/css");

      for (var i = 0; i < styleSheets.length; i++) {
        processStyleSheet(styleSheets[i]);
      }

      var svgSource = (new XMLSerializer()).serializeToString(svg.node()).replace('</style>', '<![CDATA[' + styles + ']]></style>');
      var svgOutput = [doctype + svgSource];
      link.attr("href", URL.createObjectURL(new Blob(svgOutput, { "type" : "text\/xml" })));

      function processStyleSheet(ss) {
        for (var i = 0; i < ss.cssRules.length; i++) {
          var rule = ss.cssRules[i];
          if (rule.type === 3) {
            // Import Rule
            processStyleSheet(rule.styleSheet);
          } else {
            styles += "\n" + rule.cssText;
          }
        }
      }
    })
    .on("mouseout", function() {
      setTimeout(function() {
        URL.revokeObjectURL(this.href);
      }, 10);
    });

  }

};