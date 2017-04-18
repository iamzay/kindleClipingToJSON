function JsonCreator(dataCollector){
    this.data=dataCollector;
}

JsonCreator.prototype.create=function(){
    this.createFile(this.data.bookList,'bookList.json');
    this.createFile(this.data.mark,'mark.json');
};

JsonCreator.prototype.createFile=function(obj,fileName){
    var blob=new Blob([JSON.stringify(obj,null,2)],{type:'application/json'});

    saveAs(blob,fileName);
};
