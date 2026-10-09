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

    float x1, x11;
    float l;           // loop width in mm
    double f;          // frequency of ultrasonic wave in Hz
    double v;          // velocity of ultrasonic wave in m/s
    double wavelength; // wavelength of ultrasonic wave in meters

    cout << "<--- Exp-8 To find the velocity of ultrasonic wave in a given liquid using ultrasonic interferrometer --->" << endl;

    cout << "(All readings should be in mm)\n\n";
    cout << "Enter value of x1 (first reading): ";
    cin >> x1;
    cout << endl;
    cout << "Enter value of x11 (last reading): ";
    cin >> x11;
    cout << endl;

    l = (x11 - x1) / 10; // Loop width in mm
    cout << "Loop width (l) in mm: " << l << endl;

    l = l * 1e-3; // Convert loop width to meters
    cout << "Loop width (l) in meters: " << l << endl;
    cout << endl;

    cout << "Enter the frequency of ultrasonic wave (f) in Hz(if its in dcientific notation then write like 2 * 10^6 = 2e6): ";
    cin >> f;
    cout << endl;

    wavelength = 2 * l; // Calculate wavelength
    cout << "Wavelength (λ) for the ultrasonic wave: " << wavelength << " meters" << endl;
    cout << "(by using wavelength (λ) = 2 * loop width (l))\n";
    cout << endl;
    v = f * wavelength; // Calculate velocity
    cout << "Velocity of ultrasonic wave: " << v << " m/s" << endl;
    cout << "(by using this formula v = frequency x wavelength)\n";
    printFinalMessage();

    return 0;
}
