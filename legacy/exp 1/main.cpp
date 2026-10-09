// Exp-1 To measure the divegence of the laser beam
#include <iostream>
#include <cmath>   // library to pow function
#include <iomanip> // For formatting output
using namespace std;

// strating function
void printWelcomeMessage()
{
    std::cout << "******************************************************" << std::endl;
    std::cout << "*                                                    *" << std::endl;
    std::cout << "*          Welcome to the Physics Experiments        *" << std::endl;
    std::cout << "*                Practical File Program              *" << std::endl;
    std::cout << "*                                                    *" << std::endl;
    std::cout << "******************************************************" << std::endl;
}

// ending
void printFinalMessage()
{
    std::cout << std::endl;
    std::cout << "******************************************************" << std::endl;
    std::cout << "*                                                    *" << std::endl;
    std::cout << "*          Thank you for using the Physics           *" << std::endl;
    std::cout << "*                Experiments Program!                *" << std::endl;
    std::cout << "*                                                    *" << std::endl;
    std::cout << "******************************************************" << std::endl;
    std::cout << std::endl;
     std::cout << "We hope you found these simulations insightful and educational." << std::endl;
    std::cout << "Your feedback is valuable to us. Please let us know your thoughts and suggestions on shehzadchouhan260@gmail.com." << std::endl;
    std::cout << "Thank you!" << std::endl;
}

int main()
{
    printWelcomeMessage();
    cout << "\n\n<--- Exp-1 To measure the divegence of the laser beam--->" << endl;

    cout << "(All readings should be in cm)\n\n";
    float D;
    cout << "Enter your Displacement D(distance from laser beam to graph paper) : \n";
    cin >> D;
    cout << "Enter your Spot Sizes(w):-\n";
    float w1, w2, w3;
    cout << "spot size(w1):";
    cin >> w1;
    cout << "spot size(w2):";
    cin >> w2;
    cout << "spot size(ws):";
    cin >> w3;

    // taking power of w1 w2 w3
    float a = pow(w1, 2);
    float b = pow(w2, 2);
    float c = pow(w3, 2);

    float d = a - (2 * b) + c;

    float e = d / 2;

    float f = sqrt(e);

    float g = f / 200;
    cout << endl;
    cout << "Angle of divergence(theta) = ";
    cout << g << endl;

    printFinalMessage();

    return 0;
}