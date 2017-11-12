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
    public:
    string parse(string file_name)
    {
        stringstream ss;
        //opens file
        std::ifstream file(file_name.c_str());
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
    dbcpp d;
    string fileContents = d.parse(st);
    //calls the parse function
    std::cout << "fileContents = " << fileContents << std::endl;
    return 0;
}