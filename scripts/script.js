async function loadModel() {
    model = undefined;
    model = await tf.loadLayersModel("https://raw.githubusercontent.com/kshitij-arora/HealthBuddy/main/resources/model/model.json");
    console.log("model loaded")
}
loadModel();

var symptom_div_ids =[];

symptom_div_ids.push('name-div');
symptom_div_ids.push('age-div');
symptom_div_ids.push('gender-div');
symptom_div_ids.push('fever-div');
symptom_div_ids.push('tiredness-div');
symptom_div_ids.push('dry-cough-div');
symptom_div_ids.push('difficulty-in-breathing-div');
symptom_div_ids.push('sore-throat-div');
symptom_div_ids.push('loss-of-smell-or-taste-div');
symptom_div_ids.push('nasal-congestion-div');
symptom_div_ids.push('runny-nose-div');
symptom_div_ids.push('diarrhea-div');
symptom_div_ids.push('direct-contact-with-someone-infected-div');

var symptom_input_ids =[];

symptom_input_ids.push('name');
symptom_input_ids.push('age');
symptom_input_ids.push(['gender-male', 'gender-female']);
symptom_input_ids.push(['fever-yes', 'fever-no']);
symptom_input_ids.push(['tiredness-yes', 'tiredness-no']);
symptom_input_ids.push(['dry-cough-yes', 'dry-cough-no']);
symptom_input_ids.push(['difficulty-in-breathing-yes', 'difficulty-in-breathing-no']);
symptom_input_ids.push(['sore-throat-yes', 'sore-throat-no']);
symptom_input_ids.push(['loss-of-smell-or-taste-yes', 'loss-of-smell-or-taste-no']);
symptom_input_ids.push(['nasal-congestion-yes', 'nasal-congestion-no']);
symptom_input_ids.push(['runny-nose-yes', 'runny-nose-no']);
symptom_input_ids.push(['diarrhea-yes', 'diarrhea-no']);
symptom_input_ids.push(['direct-contact-with-someone-infected-yes', 'direct-contact-with-someone-infected-no']);

current_index=0;

function check_filled(index) {

    if(index<2) {

        val = document.getElementById(symptom_input_ids[index]).value;
        if(val=='')
            return 0;
        else
            return 1;

    }
    else {

        val1 = document.getElementById(symptom_input_ids[index][0]).checked;
        val2 = document.getElementById(symptom_input_ids[index][1]).checked;
        if (val1==1 || val2==1)
            return 1;
        else
            return 0;
    }

}

function make_prediction() {

    console.log("model started")

    var male, age, fever, runnynose, sorethroat, tiredness, DryCough, difficultyinbreathing, LossOfSmellOrTaste, Diarrhea, DirectContactWithSomeone, output;
    age = Number(document.getElementById('age').value);
    male = Number(document.getElementById('gender-male').checked);
    fever = Number(document.getElementById('fever-yes').checked);
    runnynose = Number(document.getElementById('runny-nose-yes').checked);
    sorethroat = Number(document.getElementById('sore-throat-yes').checked);
    tiredness = Number(document.getElementById('tiredness-yes').checked);
    DryCough = Number(document.getElementById('dry-cough-yes').checked);
    difficultyinbreathing = Number(document.getElementById('difficulty-in-breathing-yes').checked);
    LossOfSmellOrTaste = Number(document.getElementById('loss-of-smell-or-taste-yes').checked);
    Diarrhea = Number(document.getElementById('diarrhea-yes').checked);
    DirectContactWithSomeone = Number(document.getElementById('direct-contact-with-someone-infected-yes').checked);
    NasalCongestion = Number(document.getElementById('nasal-congestion-yes').checked);

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

    output = model.predict(input_tensor);
    const outputData = output.dataSync();
    // document.getElementById("answer").value = Number(outputData[1])+ extra;
    console.log(Number(outputData[1])+ extra)
    return false;

}

var body = document.getElementById("main");

function openNav() {
    document.getElementById("mySidenav").style.width = "23vw";
    body.classList.add("translucent");
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    body.classList.remove("translucent");
}

$(window).on('load resize scroll', function() {
    $('.static-bg').each(function() {
      var windowTop = $(window).scrollTop();
      var elementTop = $(this).offset().top;
      var leftPosition = elementTop - windowTop;
      if (leftPosition>650) {
        $(this)
          .find('.moving-doc')
          .css({ left: -1200 });
        document.getElementById('moving-doc').style.backgroundImage='url(\'resources/doc1aa.png\')';
      }
      else if(leftPosition>250 & leftPosition<650) {
        document.getElementById('moving-doc').style.backgroundImage='url(\'resources/doc1aa.png\')';
        document.getElementById('test-btn').classList.add('invisible')
        $(this)
          .find('.moving-doc')
          .css({ left: 3*(250-leftPosition) });
      }
      else if(leftPosition<250) {
        $(this)
            .find('.moving-doc')
            .css({ left: 0});
        console.log('hello');
        document.getElementById('moving-doc').style.backgroundImage='url(\'resources/doc1bb.png\')';
        document.getElementById('test-btn').classList.remove('invisible')
      }
    });
  });

function Next() {

    if (check_filled(current_index)) {

        if(current_index!=12) {
            document.getElementById(symptom_div_ids[current_index+1]).classList.add('active-form');
            document.getElementById(symptom_div_ids[current_index]).classList.remove('active-form');
            console.log(check_filled(current_index));
            current_index = current_index +1;
            document.getElementById('previous-div').classList.add('active-form');
            if(current_index==12) {
                document.getElementById('form').style.height='35vh';
                document.getElementById('form').style.transform='translate(0,-2.5vh)';
                document.getElementById('next').style.display = 'none';
                document.getElementById('submit').style.display = 'inline-block';
                console.log('reached');
            }
        }

    }
    else {

        document.getElementById('form').classList.add('shaker');
        setTimeout(function(){
            document.getElementById('form').classList.remove('shaker');
        }, 820);
        
    }

}

function Previous() {

    if(current_index==12) {
        document.getElementById('form').style.height='25vh';
        document.getElementById('form').style.transform='translate(0,2.5vh)';
        document.getElementById('next').style.display = 'inline-block';
        document.getElementById('submit').style.display = 'none';
    }
    document.getElementById(symptom_div_ids[current_index-1]).classList.add('active-form');
    document.getElementById(symptom_div_ids[current_index]).classList.remove('active-form');
    current_index = current_index -1;
    if(current_index==0)
        document.getElementById('previous-div').classList.remove('active-form');

}

function Choose(input_id, symptom_number, option_indx) {
    document.getElementById(input_id).checked=true;

    var chosen = $('#'+symptom_input_ids[symptom_number][option_indx]+'-options');
    var other = $('#'+symptom_input_ids[symptom_number][1-option_indx]+'-options');

    if (other.is('.option-selected')) {
        other[0].classList.remove('option-selected');
        chosen[0].classList.add('option-selected');
    }

    else if(!chosen.is('options-selected')) {
        chosen[0].classList.add('option-selected');

    }

    chosen[0].classList.add('blinking');
    setTimeout(function(){
        chosen[0].classList.remove('blinking');
        Next();
    }, 800);

}
