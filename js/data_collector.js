function DataCollector(){
  this.bookList=[];
  this.mark=[];
}

DataCollector.prototype.collect=function(cliping){
  var pattern=/([\s\S]*?)(- (?:您在|Your (?:Highlight|Note))[\s\S]*?\| )([\s\S]*?(?:[0-9]|1[0-2]):(?:[0-5][0-9]):(?:[0-5][0-9])( [PA]M)?)([\s\S]*?)={10}/g;
  var match=null;
  var record;
  var meta;

  // 删除cliping的\n和\r
  cliping=cliping.replace(/[\n\r\ufeff]/g,'');

  while((match=pattern.exec(cliping))){
    meta=this.getTitleAuthor(match[1]);
    record={};
    record.title=meta.title;
    record.author=meta.author;
    record.position=this.getPosition(match[2]);
    record.time=this.getDate(match[3])+' '+this.getTime(match[3]);
    record.content=this.getContent(match[5]);

    if(record.content.length){
      this.mark.push(record);

      if(this.bookList.indexOf(record.title)===-1){
        this.bookList.push(record.title);
      }
    }
  }
};

DataCollector.prototype.getPosition=function(positionLine){
  var pattern=/#(\d+)/;
  var pattern2=/(\d+)/;
  var match=pattern.exec(positionLine);

  if(match){
    return match[1];
  } else{
    match=pattern2.exec(positionLine);
    return !match?'':match[1];
  }
};

DataCollector.prototype.getDate=function(dateLine){
  if(dateLine[0]==='A'){
    return this.getDateFromEng(dateLine);
  } else{
    return this.getDateFromChn(dateLine);
  }
};

DataCollector.prototype.getDateFromEng=function(dateLine){
  var map={
    January:'01',
    February:'02',
    March:'03',
    April:'04',
    May:'05',
    June:'06',
    July:'07',
    August:'08',
    September:'09',
    October:'10',
    November:'11',
    December:'12'
  };
  var pattern=/[\s\S]+?, (\w+?) (\d+), (\d+)/;
  var match=pattern.exec(dateLine);
  var day='';

  if(match){
    day=this.normalizeData(match[2]);
    return match[3]+'-'+map[match[1]]+'-'+day;
  }

  return '';
};

DataCollector.prototype.getDateFromChn=function(dateLine){
  var pattern=/(\d+)年(\d+)月(\d+)日/;
  var match=pattern.exec(dateLine);
  var month='';
  var day='';

  if(match){
    month=this.normalizeData(match[2]);
    day=this.normalizeData(match[3]);
    return match[1]+'-'+month+'-'+day;
  }

  return '';
};

DataCollector.prototype.getTime=function(timeLine){
  if(timeLine[timeLine.length-1]==='M'){
    return this.getTimeFromEng(timeLine);
  } else{
    return this.getTimeFromChn(timeLine);
  }
};

DataCollector.prototype.getTimeFromEng=function(timeLine){
  var pattern=/([0-9]|1[0-2]):([0-5][0-9]):([0-5][0-9]) ([PA]M)?/;
  var match=pattern.exec(timeLine);
  var hour='';

  if(match){

    // a.m转24h制
    if(match[4]==='AM'){

      // 若为12:00 am,转为00:00 am
      if(match[1]==='12'){
        hour='00';
      } else{
        hour=this.normalizeData(match[1]);
      }
    } else{  // p.m转24h制
      hour=match[1];

      if(match[1]!=='12'){
        hour=(parseInt(match[1])+12).toString();
      }
    }

    return hour+':'+match[2]+':'+match[3];
  }

  return '';
};

DataCollector.prototype.getTimeFromChn=function(timeLine){
  var pattern=/([上下]午)([0-9]|1[0-2]):([0-5][0-9]):([0-5][0-9])/;
  var match=pattern.exec(timeLine);
  var hour='';

  if(match){

    if(match[1]==='上午'){

      if(match[2]==='12'){
        hour='00';
      } else{
        hour=this.normalizeData(match[2]);
      }
    } else{
      hour=match[2];

      if(match[2]!=='12'){
        hour=(parseInt(match[2])+12).toString();
      }
    }

    return hour+':'+match[3]+':'+match[4];
  }

  return '';
};

DataCollector.prototype.getContent=function(contentLine){
  return contentLine;
};

DataCollector.prototype.getTitleAuthor=function(titleLine){
  var cnt=1;
  var len=titleLine.length;
  var i;
  var j;

  for(i=len-2;i>=0 && cnt;--i){

    if(titleLine[i]===')'){
      ++cnt;
    }

    if(titleLine[i]=='('){
      --cnt;
    }
  }

  return {
    title:titleLine.slice(0,i),
    author:titleLine.slice(i+2,len-1)
  };
};

DataCollector.prototype.normalizeData=function(data){
  return data.length===1?'0'+data:data;
};
