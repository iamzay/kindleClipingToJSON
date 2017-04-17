window.onload=function(){
    var dropbox=document.querySelector(".dropbox");

    dropbox.addEventListener("dragenter",removeDefault,false);
    dropbox.addEventListener("dragover",removeDefault,false);
    dropbox.addEventListener("drop",dragHandler,false);

    test();
};

function removeDefault(event){
    event.stopPropagation();
    event.preventDefault();
}

function dragHandler(event){
    removeDefault(event);

    var dt=event.dataTransfer;
    var files=dt.files;

    processFile(files);
}

function processFile(files){
    var fileReader=new FileReader();

    fileReader.readAsText(files[0]);

    fileReader.addEventListener("load",function(event){
        var dataCollector=new DataCollector();

        dataCollector.collect(event.target.result);

        console.log(dataCollector.bookList);
        console.log(dataCollector.mark);

        var jsonCreator=new JsonCreator(dataCollector);
        jsonCreator.create();
    });
}

function test(){
    var iframe=document.querySelector("#frmFile");
    var cliping=iframe.contentWindow.document.body.childNodes[0].innerHTML;

    alert(cliping);
}
