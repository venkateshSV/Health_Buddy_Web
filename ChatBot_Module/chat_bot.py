import sys
import os

def reset():

    if os.path.exists('C://Users/hp/Desktop/Health_Buddy_Web/ChatBot_Module/dynamic_data/num_days.txt'):
        os.remove('C://Users/hp/Desktop/Health_Buddy_Web/ChatBot_Module/dynamic_data/num_days.txt')
    if os.path.exists('C://Users/hp/Desktop/Health_Buddy_Web/ChatBot_Module/dynamic_data/main_symptom.txt'):
        os.remove('C://Users/hp/Desktop/Health_Buddy_Web/ChatBot_Module/dynamic_data/main_symptom.txt')
    if os.path.exists('C://Users/hp/Desktop/Health_Buddy_Web/ChatBot_Module/dynamic_data/predicted_symptoms.txt'):
        os.remove('C://Users/hp/Desktop/Health_Buddy_Web/ChatBot_Module/dynamic_data/predicted_symptoms.txt')
    if os.path.exists('C://Users/hp/Desktop/Health_Buddy_Web/ChatBot_Module/dynamic_data/additional_symptoms.txt'):
        os.remove('C://Users/hp/Desktop/Health_Buddy_Web/ChatBot_Module/dynamic_data/additional_symptoms.txt')

    quit()

if sys.argv[1]=='reset':
    reset()
    print('ok',' ', 'reset')

import pandas as pd
import pyttsx3
from sklearn import preprocessing
from sklearn.tree import DecisionTreeClassifier,_tree
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.model_selection import cross_val_score
from sklearn.svm import SVC
import csv
import warnings

warnings.filterwarnings("ignore", category=DeprecationWarning)


training = pd.read_csv('C://Users/hp/Desktop/Karan/Node.js/projectnew/ChatBot_Module/Training.csv')
testing= pd.read_csv('C://Users/hp/Desktop/Karan/Node.js/projectnew/ChatBot_Module/Testing.csv')
cols= training.columns
cols= cols[:-1]
x = training[cols]
y = training['prognosis']
y1= y

reduced_data = training.groupby(training['prognosis']).max()

#mapping strings to numbers
le = preprocessing.LabelEncoder()
le.fit(y)
y = le.transform(y)


x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.33, random_state=42)
testx    = testing[cols]
testy    = testing['prognosis']  
testy    = le.transform(testy)


clf1  = DecisionTreeClassifier()
clf = clf1.fit(x_train,y_train)
# print(clf.score(x_train,y_train))
# print ("cross result========")
scores = cross_val_score(clf, x_test, y_test, cv=3)
# print (scores)
scores.mean()


model=SVC()
model.fit(x_train,y_train)
# print("for svm: ")
model.score(x_test,y_test)

importances = clf.feature_importances_
indices = np.argsort(importances)[::-1]
features = cols

def readn(nstr):
    engine = pyttsx3.init()

    engine.setProperty('voice', "english+f5")
    engine.setProperty('rate', 130)

    engine.say(nstr)
    engine.runAndWait()
    engine.stop()


severityDictionary=dict()
description_list = dict()
precautionDictionary=dict()

symptoms_dict = {}

for index, symptom in enumerate(x):
       symptoms_dict[symptom] = index
def calc_condition(exp,days):
    sum=0
    for item in exp:
         sum=sum+severityDictionary[item]
    if((sum*days)/(len(exp)+1)>13):
        print("You should take the consultation from doctor. ")
    else:
        print("It might not be that bad but you should take precautions.")


def getDescription():
    global description_list
    with open('C://Users/hp/Desktop/Karan/Node.js/projectnew/ChatBot_Module/symptom_Description.csv') as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')
        line_count = 0
        for row in csv_reader:
            _description={row[0]:row[1]}
            description_list.update(_description)




def getSeverityDict():
    global severityDictionary
    with open('C://Users/hp/Desktop/Karan/Node.js/projectnew/ChatBot_Module/symptom_severity.csv') as csv_file:

        csv_reader = csv.reader(csv_file, delimiter=',')
        line_count = 0
        try:
            for row in csv_reader:
                _diction={row[0]:int(row[1])}
                severityDictionary.update(_diction)
        except:
            pass


def getprecautionDict():
    global precautionDictionary
    with open('C://Users/hp/Desktop/Karan/Node.js/projectnew/ChatBot_Module/symptom_precaution.csv') as csv_file:

        csv_reader = csv.reader(csv_file, delimiter=',')
        line_count = 0
        for row in csv_reader:
            _prec={row[0]:[row[1],row[2],row[3],row[4]]}
            precautionDictionary.update(_prec)

def check_pattern(dis_list,inp):
    import re
    pred_list=[]
    ptr=0
    patt = "^" + inp + "$"
    regexp = re.compile(inp)
    for item in dis_list:

        # print(f"comparing {inp} to {item}")
        if regexp.search(item):
            pred_list.append(item)
            # return 1,item
    if(len(pred_list)>0):
        return 1,pred_list
    else:
        return ptr,item

def sec_predict(symptoms_exp):
    df = pd.read_csv('C://Users/hp/Desktop/Karan/Node.js/projectnew/ChatBot_Module/Training.csv')
    X = df.iloc[:, :-1]
    y = df['prognosis']
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=20)
    rf_clf = DecisionTreeClassifier()
    rf_clf.fit(X_train, y_train)

    symptoms_dict = {}

    for index, symptom in enumerate(X):
        symptoms_dict[symptom] = index

    input_vector = np.zeros(len(symptoms_dict))
    for item in symptoms_exp:
      input_vector[[symptoms_dict[item]]] = 1


    return rf_clf.predict([input_vector])


def print_disease(node):
    #print(node)
    node = node[0]
    #print(len(node))
    val  = node.nonzero() 
    # print(val)
    disease = le.inverse_transform(val[0])
    return disease

def tree_to_code(tree, feature_names):
    tree_ = tree.tree_
    # print(tree_)
    feature_name = [
        feature_names[i] if i != _tree.TREE_UNDEFINED else "undefined!"
        for i in tree_.feature
    ]

    chk_dis=",".join(feature_names).split(",")
    symptoms_present = []


    # conf_inp=int()
    while True and sys.argv[1]=='symptom':

        disease_input = sys.argv[2]
        conf,cnf_dis=check_pattern(chk_dis,disease_input)

        if conf==1:
            for num,it in enumerate(cnf_dis):
                pass

            if num==0 and cnf_dis[0]==disease_input:
                print('ok',' ', cnf_dis[0])
                sys.stdout.flush()
            else:
                print(0,' ',cnf_dis)
                sys.stdout.flush()
                disease_input=''
            # print("Did you mean: ",cnf_dis,"?(yes/no) :",end="")
            # conf_inp = input("")
            # if(conf_inp=="yes"):
            #     break
        else:
            print(0,' ','inv')
            sys.stdout.flush()
        
        if disease_input!='':
            text_file = open("C://Users/hp/Desktop/Karan/Node.js/projectnew/ChatBot_Module/dynamic_data/main_symptom.txt", "w+")
            text_file.write(disease_input)
            text_file.close()
        quit()


    while True and sys.argv[1]=='days':
        
        try:
            num_days=int(sys.argv[2])
            print('ok',' ',int(sys.argv[2]))
            text_file = open("C://Users/hp/Desktop/Karan/Node.js/projectnew/ChatBot_Module/dynamic_data/num_days.txt", "w+")
            text_file.write(sys.argv[2])
            text_file.close()
        except:
            print(0,' ', 'inv')
            sys.stdout.flush()
            
        quit()
    
    def recurse(node, depth):
        try:
            disease_input= sys.argv[2]
            num_days=int(sys.argv[3])
        except Exception as e:
            print(e)
            sys.stdout.flush()

        indent = "  " * depth
        if tree_.feature[node] != _tree.TREE_UNDEFINED:
            name = feature_name[node]
            threshold = tree_.threshold[node]

            if name == disease_input:
                val = 1
            else:
                val = 0
            if  val <= threshold:
                recurse(tree_.children_left[node], depth + 1)
            else:
                symptoms_present.append(name)
                recurse(tree_.children_right[node], depth + 1)
        else:
            present_disease = print_disease(tree_.value[node])
            # print( "You may have " +  present_disease )
            red_cols = reduced_data.columns 
            symptoms_given = red_cols[reduced_data.loc[present_disease].values[0].nonzero()]
            # dis_list=list(symptoms_present)
            # if len(dis_list)!=0:
            #     print("symptoms present  " + str(list(symptoms_present)))
            # print("symptoms given "  +  str(list(symptoms_given)) )
            symptoms_exp=[]
            additional_symptoms=[]
            for listitem in symptoms_given:
                additional_symptoms.append(listitem)           
            if sys.argv[1]=='additional_symptoms':
                try:
                    for  i,j in enumerate(additional_symptoms):
                        print(j)
                    sys.stdout.flush()
                except:
                    print(0,' inv')
                    sys.stdout.flush()
                quit()
            else:
                symptoms_exp=[]
                for i in range(int(sys.argv[4])):
                    symptoms_exp.append(sys.argv[i+5])

            second_prediction=sec_predict(symptoms_exp)
            # print(second_prediction)
            calc_condition(symptoms_exp,num_days)
            if(present_disease[0]==second_prediction[0]):
                print("You may have ", present_disease[0])

                print(description_list[present_disease[0]])

                # readn(f"You may have {present_disease[0]}")
                # readn(f"{description_list[present_disease[0]]}")

            else:
                print("You may have ", present_disease[0], "or ", second_prediction[0])
                print(description_list[present_disease[0]])
                print(description_list[second_prediction[0]])

            # print(description_list[present_disease[0]])
            precution_list=precautionDictionary[present_disease[0]]
            print("Take following measures : ")
            for  i,j in enumerate(precution_list):
                print(i+1,")",j)
            sys.stdout.flush()
            # confidence_level = (1.0*len(symptoms_present))/len(symptoms_given)
            # print("confidence level is " + str(confidence_level))
    if sys.argv[1]=='additional_symptoms' or sys.argv[1]=='responses':
        recurse(0, 1)

getSeverityDict()
getDescription()
getprecautionDict()
tree_to_code(clf,cols)
reset()

