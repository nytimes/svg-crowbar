var SVGCrowbar = {

  init: function(selector, filename) {

    var title = filename ? filename : "untitled",
        svg = d3.select(selector ? selector : "svg"),
        parent = d3.select("body");

    var link = parent.append("a")
        .attr("href", "#")
        .attr("class", "svg-crowbar")
        .attr("target", "_blank")
        .attr("download", title + ".svg")
        .style("margin-top", "10px");

    link.append("button")
        .text("Save " + title + ".svg")
        .style("display", "block");

    link.on("mouseover", function() {
      var doctype = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">',
          styles = "",
          remoteStyleSheetURLs = [],
          link = d3.select(this),
          i = 0;

      d3.selectAll("style").each(function() {
        var n = d3.select(this);
        if (n !== undefined && n.html() !== undefined ) {
          styles += n.html();
        }
      });

      svg.attr("xmlns", d3.ns.prefix.svg)
          .attr("version", "1.1")
        .insert("defs", ":first-child")
        .append("style")
          .attr("type", "text/css");

      link.select("button").text("Processing ...")

      // TODO Find imported stylesheets
      // @import url(http://graphics8.nytimes.com/css/);
      // remoteStyleSheetURLs.push("imported.css")

      // Find linked stylesheets
      d3.selectAll("link[type='text/css']").each(function(n) {
        remoteStyleSheetURLs.push(d3.select(this).property("href"));
      });

      // Fetching all remote stylesheets
      i = remoteStyleSheetURLs.length;
      fetchRemoteStyleSheet();

      function fetchRemoteStyleSheet(remoteStyles) {
        if (remoteStyles) {
          styles += "\n" + remoteStyles + "\n";
        }
        if (i === 0) {
          cssReady();
        } else {
          i = i - 1;
          d3.text(remoteStyleSheetURLs[i], fetchRemoteStyleSheet);
        }
      }

      function cssReady() {
        link.select("button").text("Save " + title + ".svg")
        var svgSource = (new XMLSerializer()).serializeToString(svg.node()).replace('</style>', '<![CDATA[' + styles + ']]></style>');
        var svgOutput = [doctype + svgSource];
        link.attr("href", URL.createObjectURL(new Blob(svgOutput, { "type" : "text\/xml" })));
      }

    })
    .on("mouseout", function() {
      setTimeout(function() {
        URL.revokeObjectURL(this.href);
      }, 10);
    });

  }

};