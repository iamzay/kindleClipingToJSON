 window.onload=function(){
  var dropbox=document.querySelector('.dropbox');

  dropbox.addEventListener('dragenter',removeDefault,false);
  dropbox.addEventListener('dragover',removeDefault,false);
  dropbox.addEventListener('drop',dropHandler,false);

  test();
};

function removeDefault(event){
  event.stopPropagation();
  event.preventDefault();
}

function dropHandler(event){
  var dt=event.dataTransfer;
  var files=dt.files;

  removeDefault(event);

  if(!(/[\s\S]*.txt/.exec(files[0].name))){
    alert('请放入一个txt文件');
    return;
  }

  processFile(files[0]);
}

function processFile(file){
  var fileReader=new FileReader();

  fileReader.addEventListener('load',function(event){
    var dataCollector=new DataCollector();
    var jsonCreator=new JsonCreator();

    dataCollector.collect(event.target.result);
    jsonCreator.create(dataCollector);
    });

  fileReader.readAsText(file);
}

function test(){
  var iframe=document.querySelector('#frmFile');
  var cliping=iframe.contentWindow.document.body.childNodes[0].innerHTML;
  var dataCollector=new DataCollector();

  dataCollector.collect(cliping);

  printData(dataCollector);
}

function printData(data){
  console.log("bookList:");
  console.log(data.bookList);

  console.log("mark:");
  console.log(data.mark);
}
