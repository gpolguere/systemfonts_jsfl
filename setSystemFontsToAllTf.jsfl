var textAttributes = [
	"aliasText", "alignment", "autoKern",
	"bold", "characterPosition", "characterSpacing",
	"face", "fillColor", "indent",
	"italic", "leftMargin", "letterSpacing",
	"lineSpacing", "rightMargin", "rotation",
	"size", "target", "url"
];
var dom = fl.getDocumentDOM();
var changedElements = [];
var textAttr;
var library = dom.library;
var libraryItems = library.items;
var libraryItem;

// make sure we are not in edit mode
dom.exitEditMode();

changeAllTextsInTimeline(dom.getTimeline(), changedElements);

// do the same for library items
for(var h in libraryItems) {
	libraryItem = libraryItems[h];
	if(library.editItem(libraryItem.name)) {
		changeAllTextsInTimeline(dom.getTimeline(), changedElements);
		dom.exitEditMode();
	}
}

dom.publish();

// set elements edited as before
changeAllTextsInTimeline(dom.getTimeline(), changedElements, true);

// do the same for library items
for(var h in libraryItems) {
	libraryItem = libraryItems[h];
	if(library.editItem(libraryItem.name)) {
		changeAllTextsInTimeline(dom.getTimeline(), changedElements, true);
		dom.exitEditMode();
	}
}

fl.trace("DOCUMENT PUBLISHED WITHOUT FONTS");

function getTextAttr(elt) {
	var elementAttributes = {};
	for each(var attr in textAttributes) {
		if(elt.getTextAttr(attr) !== "") {
			elementAttributes[attr] = elt.getTextAttr(attr);
		}
	}
	return elementAttributes;
}

function setTextAttr(elt, attributes) {
	for(var attr in attributes) {
		if(attributes[attr] !== "") {
			elt.setTextAttr(attr, attributes[attr]);
		}
	}
}

// change all the textfields in current timeline
function changeAllTextsInTimeline(timeline, changedElts, back) {
	var frames;
	var elements;
	var element;
	var layers = timeline.layers;
	for(var i in layers) {
		frames = layers[i].frames;
		for(var j in frames) {
			elements = frames[j].elements;
			for(var k in elements) {
				element = elements[k];
				if(element.elementType == "text") {
					if(back) {
						for(var l in changedElts) {
							if(element == changedElts[l].element) {
								// element.fontRenderingMode = changedElts[l].fontRenderingMode;
								setTextAttr(element, changedElts[l].textAttr);
							}
						}
					} else {
						textAttr = getTextAttr(element);
						changedElts.push({element: element, fontRenderingMode: element.fontRenderingMode, textAttr: textAttr});
						element.setTextAttr("face", "_sans");
						// element.fontRenderingMode = "device";
					}
				}
			}
		}
	}
}