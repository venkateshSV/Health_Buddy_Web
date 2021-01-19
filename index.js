var express = require('express');
var bodyParser = require('body-parser');
const {PythonShell} =require('python-shell'); 
const tf = require('@tensorflow/tfjs');
var app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.post('/one_health',async function(req,res){
    var json = req.body;
    console.log("model started")
    model = await tf.loadLayersModel("https://raw.githubusercontent.com/kshitij-arora/HealthBuddy/main/resources/model/model.json");
    console.log("model loaded")
    var male, age, fever, runnynose, sorethroat, tiredness, DryCough, difficultyinbreathing, LossOfSmellOrTaste, Diarrhea, DirectContactWithSomeone, output;
    age = json["Age"]
    male = json["Male"]
    fever = json["Fever"]
    runnynose = json["Runny nose"]
    sorethroat = json["Sore Throat"]
    tiredness = json["Tiredness"]
    DryCough = json["Dry-cough"]
    difficultyinbreathing = json["Difficulty in breathing"]
    LossOfSmellOrTaste = json["Loss of Smell or Taste"]
    Diarrhea = json["Diarrhea"]
    DirectContactWithSomeone = json["Direct contact with someone infected"]
    NasalCongestion = json["Nasal Congestion"]
    if (age<18)
        age=0
    else if (age<30)
        age=1
    else if (age<45)
        age=2
    else if (age<65)
        age=3
    else if (age<85)
        age=4
    else
        age=5

    console.log(age, male, fever, tiredness, DryCough, difficultyinbreathing, sorethroat, LossOfSmellOrTaste, NasalCongestion, runnynose, Diarrhea, DirectContactWithSomeone);
    input_tensor = tf.tensor2d([[age, male, fever, tiredness, DryCough, difficultyinbreathing, sorethroat, LossOfSmellOrTaste, NasalCongestion, runnynose, Diarrhea, DirectContactWithSomeone]]);
    console.log(String(input_tensor))    
    var extra = 0;
    extra = extra + age*1.874999999999999931e-02;
    extra = extra + male*1.485148514851485427e-02;
    extra = extra + fever*6.758116883116882523e-02;
    extra = extra + tiredness*6.561688311688311515e-02;
    extra = extra + DryCough*5.353896103896103875e-02;
    extra = extra + difficultyinbreathing*5.399999999999999939e-02;
    extra = extra + sorethroat*3.510638297872340635e-02;
    extra = extra + LossOfSmellOrTaste*8.478260869565217017e-02;
    extra = extra + NasalCongestion*2.857142857142857054e-02;
    extra = extra + runnynose*2.068965517241379282e-02;
    extra = extra + Diarrhea*5.357142857142857539e-02;
    extra = extra + DirectContactWithSomeone*5.714285714285714107e-02;
    var response = Number(extra);
    console.log(Number(extra))
    output = model.predict(input_tensor);
    console.log(output);
    const outputData = output.dataSync();
    console.log(outputData)
    res.send({"value": Number(outputData[1])+extra})
})
app.post('/additional_symptom',function(req,res){
    var json = req.body;

    options = { 
        mode: 'text', 
        pythonPath: 'C://Users/hp/AppData/Local/Programs/Python/Python38/python',
        pythonOptions: ['-u'], 
        scriptPath: 'C://Users/hp/Desktop/Health_Buddy_Web/ChatBot_Module', 
        args: ['additional_symptoms',json["symptom"],json["days"]]
    }; 
      
    PythonShell.run('chat_bot.py', options, function (err, result){ 
          if (err) 
          res.send(err)
          else 
          res.send(result)
    });
})
app.post('/result',function(req,res){
    var json = req.body;
    var symptom = json["symptom"]
    var days = json["days"]
    var data = json["data"]
    var argv = [];
    argv.push("responses");
    argv.push(symptom);
    argv.push(days);
    if(!data.includes(","))
    {
        argv.push(1);
        argv.push(data.substring(1,data.length-1))
    }
    else
    {
        data = data.split(",");
        argv.push(data.length);
        for(i=0;i<data.length;i++)
        {
        if(i==0)
        argv.push(data[i].substring(1,data[i].length))
        else if(i==data.length-1)
        argv.push(data[i].substring(1,data[i].length-1))
        else
        argv.push(data[i].substring(1,data[i].length))
        }
    }
    let options = { 
        mode: 'text', 
        pythonPath: 'C://Users/hp/AppData/Local/Programs/Python/Python38/python',
        pythonOptions: ['-u'], 
        scriptPath: 'C://Users/hp/Desktop/Health_Buddy_Web/ChatBot_Module', 
        args: argv
    }; 
    PythonShell.run('chat_bot.py', options, function (err, result){ 
          if (err) throw err; 
          console.log(result);
          res.send(result); 
    });
})
app.get('/',(req,res)=>{
    res.send("HELLO WORLD!")
})
app.listen('3000', function () {
    console.log('Started');
});