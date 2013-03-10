chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    var html = d3.select(".container");

    var headline = html.append("h3")
        .text("The Crowbar");

    headline.append("span")
        .text(" found " + (request.svgs.length === 0 ? "no" : request.svgs.length) + " SVG node" + (request.svgs.length === 1 ? "" : "s"));

    var downloads = html.append("div")
        .attr("class", "downloads");

    var download = downloads.selectAll(".download")
        .data(request.svgs)
      .enter().append("div")
        .attr("class", "download")
        .on("click", function(d, i) {
          d3.event.preventDefault();
          chrome.tabs.getSelected(null, function(tab) {
            chrome.tabs.sendMessage(tab.id, {id: i}, function(response) {
              // TODO Exit popup?
            });
          });
        });

    download.append("div")
        .attr("class", "number")
        .text(function(d, i) { return "#" + (i + 1); });

    var dId = download.append("div").attr("class", "details");
    dId.append("span").attr("class", "label").text("ID:");
    dId.append("span").text(function(d) { return d.id ? d.id : "null"; });

    var dClass = download.append("div").attr("class", "details");
    dClass.append("span").attr("class", "label").text("Class:");
    dClass.append("span").text(function(d) { return d.class ? d.class : "null"; });

    var dSize = download.append("div").attr("class", "details");
    dSize.append("span").attr("class", "label").text("Size:");
    dSize.append("span").text(function(d) { return "[" + d.bbox.width + ", " + d.bbox.height + "]"; });

    var dPosition = download.append("div").attr("class", "details");
    dPosition.append("span").attr("class", "label").text("Position:");
    dPosition.append("span").text(function(d) { return "[" + d.bbox.left + ", " + d.bbox.top + "]"; });

    var dChildren = download.append("div").attr("class", "details");
    dChildren.append("span").attr("class", "label").text("Children:");
    dChildren.append("span").text(function(d) { return d.childElementCount; });

  });

chrome.tabs.executeScript(null, {file: "d3.v3.min.js"});
chrome.tabs.executeScript(null, {file: "queue.v1.min.js"});
chrome.tabs.executeScript(null, {file: "crowbar.js"});

