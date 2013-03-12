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
    createPopover(SVGSources);
  }

  function createPopover(sources) {

    closePopover();

    var body = d3.select("body");

    var html = body.append("div")
        .attr("id", "svg-crowbar")
        .style("position", "fixed")
        .style("z-index", 1000)
        .style("top", "30px")
        .style("right", "30px")
        .style("background", "rgba(0, 0, 0, 0.8)")
        .style("padding", "20px")
        .style("margin", 0)
        .style("border-radius", "4px")
        .style("color", "white")
        .style("font-family", "'Helvetica Neue'");

    var close = html.append("div")
        .text("X")
        .style("position", "absolute")
        .style("font-weight", "bold")
        .style("right", "-9px")
        .style("top", "-9px")
        .style("border", "solid 2px white")
        .style("cursor", "pointer")
        .style("text-align", "center")
        .style("font-size", "10px")
        .style("line-height", "18px")
        .style("border-radius", "20px")
        .style("background", "#c33")
        .style("width", "18px")
        .style("height", "18px")
        .on("click", closePopover);

    var headline = html.append("div")
        .text("The Crowbar");

    headline.append("span")
        .text(" found " + (sources.length === 0 ? "no" : sources.length) + " SVG node" + (sources.length === 1 ? "" : "s"));

    var buttons = html.append("div")
        .attr("class", "buttons");

    var button = buttons.selectAll(".button")
        .data(sources)
      .enter().append("div")
        .attr("class", "button")
        .style("font-size", "13px")

    button.append("div")
        .attr("class", "download")
        .text(function(d, i) { return "Download #" + (i + 1); })
        .style("cursor", "pointer")
        .style("margin", "10px 0 10px 0")
        .style("font-size", "16px")
        .style("padding", "4px")
        .style("border-radius", "3px")
        .style("border", "solid 1px rgba(255, 255, 255, 0.8)")
        .style("background", "black")
        .on("click", function(d, i) {
          d3.event.preventDefault();
          download(d.source);
          // closePopover();
        });

    button.each(function(source) {
      var detail = d3.select(this).selectAll(".detail")
          .data(["id", "class", "childElementCount", "top", "left", "width", "height"])
        .enter().append("div")
          .attr("class", "detail");

      detail.append("span")
          .style("color", "#bbb")
          .text(function(d) { return d + ": "; });
      detail.append("span")
          .text(function(d) { return source[d] ? source[d] : "null"; });
    });

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