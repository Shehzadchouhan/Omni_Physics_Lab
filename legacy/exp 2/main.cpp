#include <iostream>
#include <cmath>
using namespace std;

int n;
float Dav = 0.0, dav = 0.0;

// starting function
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
    std::cout << "Your feedback is valuable to us. Please let us know your thoughts and suggestions on shehzadchouhan260@gmail.com." << std::endl;
    std::cout << "Thank you!" << std::endl;
}

void diameter(float D[])
{
    Dav = 0.0; // Reset Dav before calculation
    for (int i = 0; i < n; i++)
    {
        cout << "Enter the diameter Dav" << i + 1 << ": ";
        cin >> D[i];
        Dav += D[i];
    }
    Dav /= n;
    cout << "Average Diameter (Dav) = " << Dav << " meters" << endl;
}

void thickness(float d[])
{
    dav = 0.0; // Reset dav before calculation
    for (int i = 0; i < n; i++)
    {
        cout << "Enter the thickness dav" << i + 1 << ": ";
        cin >> d[i];
        dav += d[i];
    }
    dav /= n;
    cout << "Average Thickness (dav) = " << dav << " meters" << endl;
}

int main()
{
    printWelcomeMessage();

    cout << "<--- Exp-2 To find the dielectric constant of a solid sample --->" << endl;
    cout << "(All units must be in SI)" << endl;

    float cs, LCG, LCV, Vs, Vd;
    cout << "Enter standard capacitor Cs (in scientific notation used as 50 * 10^-12 = 50e-12): ";
    cin >> cs;
    cout << "Enter least count of screw gauge (LCG): ";
    cin >> LCG;
    cout << "Enter least count of vernier caliper (LCV): ";
    cin >> LCV;
    cout << "Enter standard voltage capacitor (Vs): ";
    cin >> Vs;
    cout << "Enter dielectric voltage (Vd): ";
    cin >> Vd;
    cout << "Enter the number of readings for diameter (D) and thickness (d): ";
    cin >> n;

    // Allocate memory for arrays
    float *D = new float[n];
    float *d = new float[n];

    // Get the unit of measurement
    char unit;
    cout << "Choose your units (m for meters / c for centimeters): ";
    cin >> unit;

    diameter(D);
    thickness(d);

    // Unit conversion if needed
    if (unit == 'c')
    {
        Dav /= 100; // Convert cm to m
        dav /= 100; // Convert cm to m
    }

    // Display the converted values if unit was in cm
    if (unit == 'c')
    {
        cout << "Converted Average Diameter (Dav) = " << Dav << " meters" << endl;
        cout << "Converted Average Thickness (dav) = " << dav << " meters" << endl;
    }

    // Capacity with dielectric slab (Cd)
    float Cd = (Vs * cs) / Vd;
    cout << "Cd = " << Cd << " F" << endl;

    // Capacity without dielectric slab (Co)
    // Break down the calculation to avoid precision issues
    float numerator = 3.14 * pow(Dav, 2) * 8.85e-12;
    float denominator = 4 * dav;
    float Co = numerator / denominator;
    cout << "Co = " << Co << " F" << endl;

    // Dielectric constant (k)
    float k = Cd / Co;
    cout << "Your dielectric constant (K) is: " << k << endl;

    // Free allocated memory
    delete[] D;
    delete[] d;

    printFinalMessage();

    return 0;
}
