(function () {
    "use strict";

    function initialize() {
        WinJS.UI.processAll().done(function () {
            document.getElementById('find').addEventListener('click', getLinks);

            function getLinks() {
                // Create the xhr options
                var options = {
                    url: "http://en.wikipedia.org/wiki/" + document.getElementById("selectedArticle").value,
                    responseType: "document"
                };

                // Make the Ajax request
                WinJS.xhr(options).done(
                    function (xhr) {
                        // Get the references from wikipedia
                        // Super hacky need a better way to do this
                        var references = [];
                        var listType = "";
                        try {
                            references = xhr.response.querySelectorAll("#References")[0].parentNode.nextSibling.nextSibling;

                            if (references.nodeName != "UL") {
                                if (references.childNodes[1].nodeName == "UL") {
                                    listType = "UL";
                                } else if (references.nodeName == "OL") {
                                    listType = "OL";
                                }
                                references = references.childNodes[1].childNodes;
                            } else {
                                references = references.childNodes;
                                listType = "UL";
                            }
                        } catch (err) {
                            var errorDialog = Windows.UI.Popups.MessageDialog("No references found. Try another search.", "Sorry");
                            errorDialog.showAsync();
                        }
                        
                        // Get reference to ListView control
                        var lvReferences = document.getElementById("lvReferences").winControl;

                        // Create an array of references
                        var arrayReferences = [];
                        for (var i = 0; i < references.length; i++) {
                            if (references[i].nodeName == "LI") {
                                if (references[i].querySelectorAll("span").length > 0) {
                                    if (listType == "UL") {
                                        arrayReferences.push({
                                            reference: references[i].querySelectorAll("span")[0].innerHTML
                                        })
                                    } else {
                                        arrayReferences.push({
                                            reference: references[i].querySelectorAll("span")[1].innerHTML
                                        })
                                    }
                                } else {
                                    arrayReferences.push({
                                        reference: references[i].innerHTML
                                    })
                                }
                            }
                        }

                        // Create a List of references
                        var listReferences = new WinJS.Binding.List(arrayReferences);

                        // Bind the list of references to the ListView
                        lvReferences.itemDataSource = listReferences.dataSource;
                    },
                    function () {
                        var messageDialog = new Windows.UI.Popups.MessageDialog("Couldn't access the page. Please type in a valid wikipedia entry.", "Error");
                        messageDialog.showAsync();
                    }
                );
            };
        });
    };

    document.addEventListener("DOMContentLoaded", initialize);
})();