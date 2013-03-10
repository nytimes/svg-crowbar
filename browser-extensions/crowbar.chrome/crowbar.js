var svgs = d3.selectAll("svg"),
    doctype = '<?xml version="1.0" standalone="no"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">',
    styles = "",
    sources = [],
    info = []
    q = queue(1);

// Fetch all internal styles
d3.selectAll("style").each(function() {
  var n = d3.select(this);
  if (n !== undefined && n.html() !== undefined ) {
    styles += "\n" + n.html();
  }
});

// Fetching linked styles
d3.selectAll("link[type='text/css']").each(function(n) {
  q.defer(d3.text, d3.select(this).property("href"));
});

// TODO Fetch imported stylesheets
// @import url(http://graphics8.nytimes.com/css/);
// @import url('http://graphics8.nytimes.com/css/');
// @import url("http://graphics8.nytimes.com/css/");

q.awaitAll(function(error, results) {
  styles += results.join("\n");
  stylesReady();
});

function stylesReady() {
  // Find all svg nodes
  svgs.each(function() {
    var svg = d3.select(this);
    svg.attr("xmlns", d3.ns.prefix.svg)
        .attr("version", "1.1")
      .insert("defs", ":first-child")
      .append("style")
        .attr("type", "text/css");

    var source = (new XMLSerializer()).serializeToString(svg.node()).replace('</style>', '<![CDATA[' + styles + ']]></style>');
    sources.push([doctype + source]);
    info.push({
      bbox: svg.node().getBoundingClientRect(),
      class: svg.attr("class"),
      id: svg.attr("id"),
      childElementCount: svg.node().childElementCount
    })

  });

  chrome.extension.sendMessage({
    svgs: info
  });
}

// This listens for the user's choice in the popup.
// The download has to run here and not in the popover otherwise the save dialog automatically gets dismissed.
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    var url = URL.createObjectURL(new Blob(sources[request.id], { "type" : "text\/xml" }));

    var a = d3.select("body")
        .append('a')
        .attr("download", "untitled.svg")
        .attr("href", url)
        .style("display", "none");

    a.node().click();
  });

