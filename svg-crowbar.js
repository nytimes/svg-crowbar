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
    var styles = getStyles(window.document);
    var SVGSources = getSources(styles);
    if (SVGSources.length > 1) {
      createPopover(SVGSources);
    } else if (SVGSources.length > 0) {
      download(SVGSources[0]);
    } else {
      alert("The Crowbar couldn’t find any SVG nodes.");
    }
  }

  function createPopover(sources) {

    cleanup();

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
        .style("position", "absolute")
        .style("top", function(d) { return (d.top + document.body.scrollTop) + "px"; })
        .style("left", function(d) { return (document.body.scrollLeft + d.left) + "px"; })
        .style("padding", "2px 4px")
        .style("border-radius", "3px")
        .style("background", "rgba(0, 0, 0, 0.8)")
        .style("box-shadow", "0px 4px 18px rgba(0, 0, 0, 0.4)")
      .append("button")
        .style("width", "150px")
        .style("font-size", "12px")
        .style("line-height", "1.4em")
        .text(function(d, i) {
          return i + " Download svg" + (d.id ? "#" + d.id : "") + (d.class ? "." + d.class : "");
        })
        .on("click", function(d, i) {
          d3.event.preventDefault();
          download(d);
        });

    var html = body.append("div")
        .attr("class", "svg-crowbar")
        .style("background", "rgba(255, 255, 255, 0.7)")
        .style("position", "fixed")
        .style("left", 0)
        .style("top", 0)
        .style("width", "100%")
        .style("height", "100%");

  }

  function cleanup() {
    d3.selectAll(".svg-crowbar").remove();
  }

  function getSources(styles) {
    var info = [];

    var svgs = d3.selectAll("svg");
    svgs.each(processSVG);


    // get iframe svgs
    var iframes = d3.selectAll("iframe").each(function() {
      var iframeStyles = getStyles(this.contentDocument);
      var iframe = d3.select(this.contentDocument);
      iframe.selectAll("svg").each(function() {
        processSVG.call(this, iframeStyles);
      });
    });

    function processSVG(iframeStyles) {
      var svg = d3.select(this);
      var localStyles = (iframeStyles === undefined)? styles : iframeStyles;
      svg.attr("version", "1.1")
        .insert("defs", ":first-child")
          .attr("class", "svg-crowbar")
        .append("style")
          .attr("type", "text/css");

      // Some svgs would allow this attr to be set twice which kills illustrator, again.
      if (svg.attr("xmlns") === null) {
        svg.attr("xmlns", d3.ns.prefix.svg);
      };

      var source = (new XMLSerializer()).serializeToString(svg.node()).replace('</style>', '<![CDATA[' + localStyles + ']]></style>');
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
    }
    return info;
  }

  function download(source) {
    var filename = "untitled";

    if (source.id) {
      filename = source.id;
    } else if (source.class) {
      filename = source.class;
    } else if (window.document.title) {
      filename = window.document.title.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    }

    var url = URL.createObjectURL(new Blob(source.source, { "type" : "text\/xml" }));

    var a = d3.select("body")
        .append('a')
        .attr("class", "svg-crowbar")
        .attr("download", filename + ".svg")
        .attr("href", url)
        .style("display", "none");

    a.node().click();

    setTimeout(function() {
      URL.revokeObjectURL(url);
    }, 10);
  }

  function getStyles(doc) {
    var styles = "",
        styleSheets = doc.styleSheets;

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