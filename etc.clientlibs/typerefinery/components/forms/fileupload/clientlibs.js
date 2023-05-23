/* clientlib source: /apps/typerefinery/clientlibs/vendor/fileupload/imageuploadify.min.js */
;(function($,window,document,undefined){window.addEventListener("dragover",function(e){e=e||event;e.preventDefault();},false);window.addEventListener("drop",function(e){e=e||event;e.preventDefault();},false);const compareMimeType=(mimeTypes,fileType,formatFile)=>{if(mimeTypes.length<2&&mimeTypes[0]==="*"){return true;}
for(let index=1;index<mimeTypes.length;index+=3){if(mimeTypes[index+1]==="*"&&fileType.search(new RegExp(mimeTypes[index]))!=-1){return true;}
else if(mimeTypes[index+1]&&mimeTypes[index+1]!="*"&&fileType.search(new RegExp("\\*"+mimeTypes[index+1]+"\\*"))!=-1){return true;}
else if(mimeTypes[index+1]&&mimeTypes[index+1]!="*"&&fileType.search(new RegExp(mimeTypes[index+1]))!=-1){return true;}
else if(mimeTypes[index+1]===""&&(fileType.search(new RegExp(mimeTypes[index]))!=-1||formatFile.search(new RegExp(mimeTypes[index]))!=-1)){return true;}}
return false;}
$.fn.imageuploadify=function(opts){const settings=$.extend({},$.fn.imageuploadify.defaults,opts);this.each(function(){const self=this;if(!$(self).attr("multiple")){return;}
let accept=$(self).attr("accept")?$(self).attr("accept").replace(/\s/g,"").split(","):null;let result=[];accept.forEach((item)=>{let regexp;if(item.search(/\//)!=-1){regexp=new RegExp("([A-Za-z-.]*)\/([A-Za-z-*.]*)","g");}
else{regexp=new RegExp("\.([A-Za-z-]*)()","g");}
const r=regexp.exec(item);result=result.concat(r);});let totalFiles=[];let counter=0;let dragbox=$(`<div class="imageuploadify well"><div class="imageuploadify-overlay"><i class="fa fa-picture-o"></i></div><div class="imageuploadify-images-list text-center"><i class="fa fa-cloud-upload"></i><span class='imageuploadify-message'>Drag&Drop Your File(s)Here To Upload</span><button type="button"class="btn btn-default">or select file to upload</button></div></div>`);let overlay=dragbox.find(".imageuploadify-overlay");let uploadIcon=dragbox.find(".imageuploadify-overlay i");let imagesList=dragbox.find(".imageuploadify-images-list");let addIcon=dragbox.find(".imageuploadify-images-list i");let addMsg=dragbox.find(".imageuploadify-images-list span");let button=dragbox.find(".imageuploadify-images-list button");const retrieveFiles=(files)=>{for(let index=0;index<files.length;++index){if(!accept||compareMimeType(result,files[index].type,/(?:\.([^.]+))?$/.exec(files[index].name)[1])){const id=Math.random().toString(36).substr(2,9);readingFile(id,files[index]);totalFiles.push({id:id,file:files[index]});}}}
const readingFile=(id,file)=>{const fReader=new FileReader();const width=dragbox.width();const boxesNb=Math.floor(width / 100);const marginSize=Math.floor((width-(boxesNb*100))/(boxesNb+1));let container=$(`<div class='imageuploadify-container'><button type='button'class='btn btn-danger glyphicon glyphicon-remove'></button><div class='imageuploadify-details'><span>${file.name}</span><span>${file.type}</span><span>${file.size}</span></div></div>`);let details=container.find(".imageuploadify-details");let deleteBtn=container.find("button");container.css("margin-left",marginSize+"px");details.hover(function(){$(this).css("opacity","1");}).mouseleave(function(){$(this).css("opacity","0");});if(file.type&&file.type.search(/image/)!=-1){fReader.onloadend=function(e){let image=$("<img>");image.attr("src",e.target.result);container.append(image);imagesList.append(container);imagesList.find(".imageuploadify-container:nth-child("+boxesNb+"n+4)").css("margin-left",marginSize+"px");imagesList.find(".imageuploadify-container:nth-child("+boxesNb+"n+3)").css("margin-right",marginSize+"px");};}
else if(file.type){let type="<i class='fa fa-file'></i>";if(file.type.search(/audio/)!=-1){type="<i class='fa fa-file-audio-o'></i>";}
else if(file.type.search(/video/)!=-1){type="<i class='fa fa-file-video-o'></i>";}
fReader.onloadend=function(e){let span=$("<span>"+type+"</span>");span.css("font-size","5em");container.append(span);imagesList.append(container);imagesList.find(".imageuploadify-container:nth-child("+boxesNb+"n+4)").css("margin-left",marginSize+"px");imagesList.find(".imageuploadify-container:nth-child("+boxesNb+"n+3)").css("margin-right",marginSize+"px");};}
deleteBtn.on("click",function(){$(this.parentElement).remove();for(let index=0;totalFiles.length>index;++index){if(totalFiles[index].id===id){totalFiles.splice(index,1);break;}}});fReader.readAsDataURL(file);};const disableMouseEvents=()=>{overlay.css("display","flex");dragbox.css("border-color","#3AA0FF");button.css("pointer-events","none");addMsg.css("pointer-events","none");addIcon.css("pointer-events","none");imagesList.css("pointer-events","none");}
const enableMouseEvents=()=>{overlay.css("display","none");dragbox.css("border-color","rgb(210, 210, 210)");button.css("pointer-events","initial");addMsg.css("pointer-events","initial");addIcon.css("pointer-events","initial");imagesList.css("pointer-events","initial");}
button.mouseenter(function onMouseEnter(event){button.css("background","#3AA0FF").css("color","white");}).mouseleave(function onMouseLeave(){button.css("background","white").css("color","#3AA0FF");});button.on("click",function onClick(event){event.stopPropagation();event.preventDefault();$(self).click();});dragbox.on("dragenter",function onDragenter(event){event.stopPropagation();event.preventDefault();counter++;disableMouseEvents();});dragbox.on("dragleave",function onDragLeave(event){event.stopPropagation();event.preventDefault();counter--;if(counter===0){enableMouseEvents();}});dragbox.on("drop",function onDrop(event){event.stopPropagation();event.preventDefault();enableMouseEvents();const files=event.originalEvent.dataTransfer.files;retrieveFiles(files);});$(window).bind("resize",function(e){window.resizeEvt;$(window).resize(function(){clearTimeout(window.resizeEvt);window.resizeEvt=setTimeout(function(){const width=dragbox.width();const boxesNb=Math.floor(width / 100);const marginSize=Math.floor((width-(boxesNb*100))/(boxesNb+1));let containers=imagesList.find(".imageuploadify-container");for(let index=0;index<containers.length;++index){$(containers[index]).css("margin-right","0px");$(containers[index]).css("margin-left",marginSize+"px");}
imagesList.find(".imageuploadify-container:nth-child("+boxesNb+"n+4)").css("margin-left",marginSize+"px");imagesList.find(".imageuploadify-container:nth-child("+boxesNb+"n+3)").css("margin-right",marginSize+"px");},500);});})
$(self).on("change",function onChange(){const files=this.files;retrieveFiles(files);});$(self).closest("form").on("submit",function(event){event.stopPropagation();event.preventDefault(event);const inputs=this.querySelectorAll("input, textarea, select, button");const formData=new FormData();for(let index=0;index<inputs.length;++index){if(inputs[index].tagName==="SELECT"&&inputs[index].hasAttribute("multiple")){const options=inputs[index].options;for(let i=0;options.length>i;++i){if(options[i].selected){formData.append(inputs[index].getAttribute("name"),options[i].value);}}}
else if(!inputs[index].getAttribute("type")||((inputs[index].getAttribute("type").toLowerCase())!=="checkbox"&&(inputs[index].getAttribute("type").toLowerCase())!=="radio")||inputs[index].checked){formData.append(inputs[index].name,inputs[index].value);}
else if($(inputs[index]).getAttribute("type") !="file"){formData.append(inputs[index].name,inputs[index].value);}}
for(var i=0;i<totalFiles.length;i++){formData.append(self.name,totalFiles[i].file);}
var xhr=new XMLHttpRequest();xhr.onreadystatechange=function(e){if(xhr.status==200&&xhr.readyState===XMLHttpRequest.DONE){window.location.replace(xhr.responseURL);}}
xhr.open("POST",$(this).attr("action"),true);xhr.send(formData);return false;});$(self).hide();dragbox.insertAfter(this);});return this;};$.fn.imageuploadify.defaults={};}(jQuery,window,document));
/* clientlib source: /apps/typerefinery/components/forms/fileupload/clientlibs/functions.js */
window.Typerefinery = window.Typerefinery || {};
Typerefinery.Components = Typerefinery.Components || {};
Typerefinery.Components.Forms = Typerefinery.Components.Forms || {};
Typerefinery.Components.Forms.Fileupload = Typerefinery.Components.Forms.Fileupload || {};


(function (ns, componentNs, document, window) {

    "use strict";

    ns.customDragAndDrop = ($component, componentConfig) => {
        // }
        let uploadButton = document.getElementById(`${componentConfig.id}-${componentConfig.name}`);
        let container = $component;
        let error = document.getElementById("error");
        let imageDisplay = document.getElementById("image-display");
        // close-icon handle click.
        $(document).on("click", ".close-icon", function () {
            if(this.id && this.id.split("close-").length >= 2){
                document.getElementById(`figure-${this.id.split("close-")[1]}`).remove();
            }
        });

        const fileHandler = (file, name, type) => {
            type = type.split("/").legnth >= 2 ? type.split("/")[1] : type; 
            if (componentConfig.accept !== "*" && componentConfig.accept && !componentConfig.accept.includes(type)) {
                //File Type Error
                error.innerText = "Please upload " + componentConfig.accept + " file type only";
                return false;
            }
            error.innerText = "";
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                //image and file name
                let imageContainer = document.createElement("figure");
                name = name?.trim()?.replace(/\s/g, "-");
                imageContainer.setAttribute("id", `figure-${name}`);
                let img = document.createElement("img");
                img.src = reader.result;
                // append a close icon which has position absolute styling.
                let closeIcon = document.createElement("span");
                closeIcon.classList.add("close-icon");
                closeIcon.classList.add("pi");
                closeIcon.classList.add("pi-times");
                closeIcon.id = `close-${name}`;
                // closeIcon.innerHTML = "&#10006;";
                imageContainer.appendChild(closeIcon);

                // add loader icon which is display none.
                let loaderIcon = document.createElement("span");
                loaderIcon.classList.add("loader-icon");
                loaderIcon.classList.add("pi");
                loaderIcon.classList.add("pi-spin");
                loaderIcon.classList.add("pi-spinner");
                loaderIcon.id = `loader-${name}`;
                // loaderIcon.innerHTML = "&#128339;";
                imageContainer.appendChild(loaderIcon);

                imageContainer.appendChild(img);
                imageContainer.innerHTML += `<figcaption >${name}</figcaption>`;
                imageDisplay.appendChild(imageContainer);
            };
        };
        uploadButton.addEventListener("change", () => {
            imageDisplay.innerHTML = "";
            Array.from(uploadButton.files).forEach((file) => {
                fileHandler(file, file.name, file.type);
            });
        });
        container.addEventListener(
            "dragenter",
            (e) => {
                e.preventDefault();
                e.stopPropagation();
                container.classList.add("active");
            },
            false
        );
        container.addEventListener(
            "dragleave",
            (e) => {
                e.preventDefault();
                e.stopPropagation();
                container.classList.remove("active");
            },
            false
        );
        container.addEventListener(
            "drop",
            (e) => {
                e.preventDefault();
                e.stopPropagation();
                container.classList.remove("active");
                let draggedData = e.dataTransfer;
                let files = draggedData.files;
                imageDisplay.innerHTML = "";
                Array.from(files).forEach((file) => {
                    fileHandler(file, file.name, file.type);
                });
            },
            false
        );
        window.onload = () => {
            error.innerText = "";
        };
    }

    ns.init = ($component) => {
        const componentConfig = componentNs.getComponentConfig($component);
        $component = document.getElementById(componentConfig.id);
        ns.customDragAndDrop($component, componentConfig);
    }
})(Typerefinery.Components.Forms.Fileupload, Typerefinery.Components, document, window);
/* clientlib source: /apps/typerefinery/components/forms/fileupload/clientlibs/behaviour.js */
window.Typerefinery = window.Typerefinery || {};
Typerefinery.Components = Typerefinery.Components || {};
Typerefinery.Components.Forms = Typerefinery.Components.Forms || {};
Typerefinery.Components.Forms.Fileupload = Typerefinery.Components.Forms.Fileupload || {};

(function (ns, document, window) {
    "use strict";
    $(document).ready(function () {
        $('[component="fileupload"]').each(function () {
            console.log('fileupload', this);
            ns.init(this);
        });
    });
})(window.Typerefinery.Components.Forms.Fileupload, document, window);

