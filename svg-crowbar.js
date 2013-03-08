var SVGCrowbar = {

  init: function(selector) {

    // Grabs all the svg nodes on the page
    var svgs = d3.selectAll(selector ? selector : "svg");

    svgs.each(function() {
      var svg = d3.select(this);
      var parent = d3.select(this.parentNode);
      var link = parent.append("a")
          .attr("href", "#")
          .attr("class", "svg-crowbar")
          .attr("target", "_blank")
          .attr("download", "untitled.svg")
          .style("margin-top", "10px");

      link.append("button")
          .text("Save as SVG")
          .style("display", "block");

      link.on("mouseover", function() {

        var doctype = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">',
            filename = "Untitled",
            styles = "";

        svg.attr("xmlns", d3.ns.prefix.svg)
            .attr("version", "1.1")
          .insert("defs", ":first-child")
          .append("style")
            .attr("type", "text/css");

        d3.selectAll("style").each(function() {
          // TODO Fetch remote stylesheets
          // <link rel="stylesheet" type="text/css" href="http://graphics8.nytimes.com/css/">
          // @import url(http://graphics8.nytimes.com/css/);

          var n = d3.select(this);
          if (n !== undefined && n.html() !== undefined ) {
            styles += n.html();
          }

        });

        var svgSource = (new XMLSerializer()).serializeToString(svg.node()).replace('</style>', '<![CDATA[' + styles + ']]></style>');
        var svgOutput = [doctype + svgSource];
        this.href = URL.createObjectURL(new Blob(svgOutput, { "type" : "text\/xml" }));

      })
      .on("mouseout", function() {
        setTimeout(function() {
          URL.revokeObjectURL(this.href);
        }, 10);

      });

    });

  }

};