#include <iostream>
#include <vector>
#include <cmath> // Include cmath for atan and sin

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

// Global variables
float L, D;
vector<float> y;         // Global vector to store y values
double rad1, rad2, rad3; // Global variables to store arctangent values
int n;                   // General number of orders
vector<float> d;         // Slits

void corners()
{
    cout << "Enter numbers of readings of corners(PP'):";
    cin >> n;

    vector<float> P(n); // Vector to store P values
    for (int i = 0; i < n; i++)
    { // Index from 0 to n-1
        cout << "Enter distance between corners P" << i + 1 << "P" << i + 1 << "' :";
        cin >> P[i];
    }

    cout << "Enter the maxima distance from screen(y=PP'/2):" << endl;
    y.resize(n); // Resize y vector to match the size of P
    for (int i = 0; i < n; i++)
    { // Index from 0 to n-1
        y[i] = P[i] / 2;
        cout << "y" << i + 1 << ": " << y[i] << endl;
    }

    // Calculate arctangent for the first three values
    if (n > 0)
        rad1 = atan(y[0] / D) * (180.0 / M_PI);
    if (n > 1)
        rad2 = atan(y[1] / D) * (180.0 / M_PI);
    if (n > 2)
        rad3 = atan(y[2] / D) * (180.0 / M_PI);
}

void displayRadians()
{
    // Function to display global rad values
    cout << "\n\nAngle of diffraction in degrees(theta):" << endl;
    // Truncate the numbers to two decimal places
    int decimalPlaces = 2; // The number of decimal places to keep
    double scale = pow(10.0, decimalPlaces);

    // Truncate rad1 to two decimal places
    rad1 = floor(rad1 * scale) / scale;

    // Truncate sinrad2 to two decimal places
    rad2 = floor(rad2 * scale) / scale;

    // Truncate rad3 to two decimal places
    rad3 = floor(rad3 * scale) / scale;

    cout << "rad1: " << rad1 << endl;
    cout << "rad2: " << rad2 << endl;
    cout << "rad3: " << rad3 << endl;
}

void slits()
{
    cout << "\nGrating element(d):" << endl;
    d.resize(3); // Resize d vector to store 3 values

    // Convert degrees to radians
    double rad1_in_radians = rad1 * (M_PI / 180.0);
    double rad2_in_radians = rad2 * (M_PI / 180.0);
    double rad3_in_radians = rad3 * (M_PI / 180.0);

    // Calculate sin(rad1), sin(sinrad2), sin(rad3)
    double sin_rad1 = sin(rad1_in_radians);
    double sin_rad2 = sin(rad2_in_radians);
    double sin_rad3 = sin(rad3_in_radians);

    int decimalPlaces = 2; // The number of decimal places to keep
    double scale = pow(10.0, decimalPlaces);

    // Truncate rad1 to two decimal places
    sin_rad1 = floor(sin_rad1 * scale) / scale;

    // Truncate sinrad2 to two decimal places
    sin_rad2 = floor(sin_rad2 * scale) / scale;

    sin_rad3 = floor(sin_rad3 * scale) / scale;

    // cout << sin_rad1 << endl;
    // cout << sin_rad2 << endl;
    // cout << sin_rad3 << endl;

    // Calculate slit values for rad1, sinrad2, and rad3
    if (n = 1)
        d[0] = n * (L) / sin_rad1; // Convert rad1 back to radians
    if (n = 2)
        d[1] = n * (L) / sin_rad2; // Convert sinrad2 back to radians
    if (n = 3)
        d[2] = n * (L) / sin_rad3; // Convert rad3 back to radians

    // Display slit values

    if (n > 0)
        cout << "d1: " << d[0] << endl;
    if (n > 1)
        cout << "d2: " << d[1] << endl;
    if (n > 2)
        cout << "d3: " << d[2] << endl;
    // double avg = (d[0] + d[1] + d[3]) / 3;
    // cout << "Mean of its grating element(d) = " << avg << endl;
}

int main()
{

    printWelcomeMessage();

    cout << "<--- Exp-3 To find the diffraction using laser beam and determine its grating element --->" << endl;
    cout << "(All units must be in cm)" << endl;
    cout << "Enter Wavelength(L):\n";
    cin >> L;
    cout << "Enter the distance between grating element and screen(D):\n";
    cin >> D;

    corners();        // Initialize and calculate y values
    displayRadians(); // Display arctangent values

    slits(); // Calculate and display slit values

    printFinalMessage();

    return 0;
}
