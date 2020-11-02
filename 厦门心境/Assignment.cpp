//Xin Lin
#include<iostream>
#include<fstream>
#include<cstring>
#include<string>
#include<cmath>
using namespace std;
class patient
{
	public:
	 int id;
	  char name[20];
	   char gender;
	    int age;
	     int birthday;
	      string visitReason;
	      void createdata();
	      void showdata();
	      void updata();
};
void patient::createdata()
{
	ofstream myfile;
	myfile.open("Patient.txt",ios::app);
	cout<<"ID: ";
    	cin>>id;
    	myfile<<id<<"  ";
    	cout<<"\nName: ";
    	cin>>name;
    	myfile<<name;
    	cout<<"\nGender: ";
    	cin>>gender;
    	myfile<<"  "<<gender;
    	cout<<"\nAge: ";
    	cin>>age;
    	myfile<<"  "<<age;
    	cout<<"\nBirthday: ";
    	cin>>birthday;
    	myfile<<"  "<<birthday;
    	cout<<"\nVisit Reason: ";
    	cin>>visitReason;
    	myfile<<"  "<<visitReason<<"\n";
    	cout<<"\n\n";
    	myfile.close();
}
void patient::showdata()
{
	string line;
	ifstream file("Patient.txt");
		if(file.is_open())
		{
			while(getline(file,line))
			{
				cout<<line<<'\n';
			}
			file.close();
		}
		else
		cout<<"Unable to open\n";
		cout<<"\n\n";
}
void patient::updata()
{
	ifstream file("Patient.txt",ios::app);
	string line,search,reason;
	if(file.is_open())
	{
		cout<<"Enter the patient's ID: ";
	getline(cin,search);
		while(file.good())
		{
			getline(file,line);
			if(line.find(search)!=string::npos)
			{
				cout<<"Updata the patient's reason: ";
				getline(cin,reason);
				
				cout<<"\nsuccess\n";
				break;
			}
		}
	}
	else
	cout<<"\nUnable to found\n";
	file.close();
}
int main()
{
	int choice;
	patient CurrentPatient;
	do
	{
			cout<<"MENU\n"
    <<"---------------------------\n"
    <<"1.Add a New Patient Record\n"
    <<"2.Show Patient Records\n"
    <<"3.Update Patient records\n"
    <<"4.Quit\n"
    <<"---------------------------\n";
    cin>>choice;
    cin.ignore();
    if(choice==1)
    CurrentPatient.createdata();
    if(choice==2)
    CurrentPatient.showdata();
    if(choice==3)
    CurrentPatient.updata();
	}while(choice!=4);
	cout<<"\n\n";
	return 0;
}
