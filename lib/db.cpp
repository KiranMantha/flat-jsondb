/*
    1. run command g++ -o c++.exe db.cpp
    2. run command c++
*/

#include <iostream>
#include <string>
#include <fstream>
using namespace std;

int parse(string file_name)
{
    int sum = 0;
    int x;
    //opens file
    std::ifstream file(file_name.c_str()); 
    if (!file)
    {
        cout << "Cannot open file\n";
        exit(1);
    }
    cout << "File is opened\n";    
    while (file >> x) {
        sum = sum + x;
    }
    //closes file
    std::cout << file.rdbuf();
    file.close();
    return sum;
}

int main()
{
    string st = "abc.txt";
    int sum = parse(st);
    //calls the parse function
    cout << "Sum = " << sum << endl; 
    return 0;
}