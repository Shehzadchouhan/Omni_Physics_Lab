#include <iostream>
#include <cmath>
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
    std::cout << std::endl;
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
    std::cout << "Your feedback is valuable to us. Please let us know your thoughts and suggestions." << std::endl;
    std::cout << "Thank you!" << std::endl;
}
int main()
{
    printWelcomeMessage();

    cout << "<--- Exp-6 To determine the attenuation and propagation losses in optical fibre --->\n(All units in SI)" << endl;

    double L;      // km
    double V1, V2; // volts
    double fibre_loss;
    double att_loss;

    cout << "Enter the length of an optical fibre L (L2 - L1) in km (in case of scientific notation eg: 10^3 => e3): ";
    cin >> L;
    cout << endl;

    cout << "Voltage readings \n";
    cout << "Enter the voltage of fibre length at L1 in volts: ";
    cin >> V1;

    cout << "Enter the voltage of fibre length at L2 in volts: ";
    cin >> V2;

    // Using log10 for base-10 logarithm
    fibre_loss = (20 / L) * std::log10(V1 / V2);
    cout << "Your Fibre loss is : " << fibre_loss << "dB/km" << endl;

    att_loss = fibre_loss / 4.343;
    cout << "Attenuation loss is : " << att_loss << "km^-1" << endl;
    printFinalMessage();

    return 0;
}
