/*
    1. run command g++ -o c++.exe db.cpp
    2. run command c++
*/

#include <iostream>
#include <string>
#include <fstream>
#include <sstream>
using namespace std;

class dbcpp
{
    string filename;
    public:
    dbcpp(string file_name){
        filename = file_name;
    }    
    string getFileContents()
    {
        stringstream ss;
        //opens file
        std::ifstream file(filename.c_str());
        if (!file)
        {
            std::cout << "Cannot open file\n";
            exit(1);
        }
        std::cout << "File is opened\n";

        //read file buffer
        ss << file.rdbuf();

        //closes file
        file.close();

        return ss.str();
    }
};

int main()
{
    string st = "abc.txt";
    dbcpp d = dbcpp(st);
    string fileContents = d.getFileContents();
    //calls the parse function
    std::cout << "fileContents = " << fileContents << std::endl;
    return 0;
}