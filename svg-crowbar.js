(function() {
  var doctype = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';

  if (window.d3 !== undefined) {
    initialize();
  } else {
    var script = document.createElement('script');
    script.onload = initialize;
    script.src = "http://d3js.org/d3.v3.min.js";
    document.getElementsByTagName('head')[0].appendChild(script);
  }

  function initialize() {
    var styles = getStyles();
    var SVGSources = getSources(styles);
    if (SVGSources.length > 1) {
      createPopover(SVGSources);
    } else if (SVGSources.length > 0) {
      download(SVGSources[0]);
    }
  }

  function createPopover(sources) {

    closePopover();

    sources.forEach(function(s1) {
      sources.forEach(function(s2) {
        if (s1 !== s2) {
          if (s1.top === s2.top && s1.left === s2.left) {
            s2.left += 140;
          };
        };
      })
    })

    var body = d3.select("body");

    var buttons = body.append("div")
        .attr("class", "svg-crowbar")
        .style("z-index", 10000000000)
        .style("position", "absolute")
        .style("top", 0)
        .style("left", 0);

    var button = buttons.selectAll(".crowbar-button")
        .data(sources)
      .enter().append("div")
        .attr("class", "crowbar-button")
        .text(function(d, i) { return "Download SVG #" + (i + 1); })
        .style("position", "absolute")
        .style("font-size", "13px")
        .style("font-family", "'Helvetica Neue'")
        .style("color", "white")
        .style("text-align", "center")
        .style("width", "150px")
        .style("top", function(d) { return (d.top + document.body.scrollTop) + "px"; })
        .style("left", function(d) { return (document.body.scrollLeft + d.left) + "px"; })
        .style("cursor", "pointer")
        .style("margin", "0")
        .style("font-size", "13px")
        .style("padding", "4px")
        .style("border-radius", "3px")
        .style("border", "solid 1px white")
        .style("background", "black")
        .style("box-shadow", "0px 4px 18px rgba(0, 0, 0, 0.4)")
        .on("click", function(d, i) {
          d3.event.preventDefault();
          download(d.source);
          closePopover();
        });

    var html = body.append("div")
        .attr("class", "svg-crowbar")
        .style("background", "rgba(255, 255, 255, 0.7)")
        .style("position", "fixed")
        .style("left", 0)
        .style("top", 0)
        .style("width", "100%")
        .style("height", "100%");

    html.append("h1")
        .style("text-align", "center")
        .text("The Crowbar found " + (sources.length === 0 ? "no" : sources.length) + " SVG node" + (sources.length === 1 ? "" : "s"))

  }

  function closePopover() {
    d3.selectAll(".svg-crowbar").remove();
    d3.select("#svg-crowbar").remove();
  }

  function getSources(styles) {
    var svgs = d3.selectAll("svg"),
        info = [];

    svgs.each(function() {
      var svg = d3.select(this);
      svg.attr("version", "1.1")
        .insert("defs", ":first-child")
          .attr("class", "svg-crowbar")
        .append("style")
          .attr("type", "text/css");

      // Some svgs would allow this attr to be set twice which kills illustrator, again.
      if (svg.attr("xmlns") === null) {
        svg.attr("xmlns", d3.ns.prefix.svg);
      };

      var source = (new XMLSerializer()).serializeToString(svg.node()).replace('</style>', '<![CDATA[' + styles + ']]></style>');
      var rect = svg.node().getBoundingClientRect()
      info.push({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        class: svg.attr("class"),
        id: svg.attr("id"),
        childElementCount: svg.node().childElementCount,
        source: [doctype + source]
      });

    });

    return info;
  }

  function download(source) {
    var url = URL.createObjectURL(new Blob(source, { "type" : "text\/xml" }));

    var a = d3.select("body")
        .append('a')
        .attr("download", "untitled.svg")
        .attr("href", url)
        .style("display", "none");

    a.node().click();

    setTimeout(function() {
      URL.revokeObjectURL(url);
    }, 10);
  }

  function getStyles() {
    var styles = "",
        styleSheets = window.document.styleSheets;

    if (styleSheets) {
      for (var i = 0; i < styleSheets.length; i++) {
        processStyleSheet(styleSheets[i]);
      }
    }

    function processStyleSheet(ss) {
      if (ss.cssRules) {
        for (var i = 0; i < ss.cssRules.length; i++) {
          var rule = ss.cssRules[i];
          if (rule.type === 3) {
            // Import Rule
            processStyleSheet(rule.styleSheet);
          } else {
            // hack for illustrator crashing on descendent selectors
            if (rule.selectorText) {
              if (rule.selectorText.indexOf(">") === -1) {
                styles += "\n" + rule.cssText;
              }
            }
          }
        }
      }
    }

    return styles;
  }

})();