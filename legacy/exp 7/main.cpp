#include <iostream>
#include <cmath>
using namespace std;

// Starting function
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

// Ending function
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

float d; // diameter
float l; // length of sample
float As;
float Ac;
float Area_Ratio;
float N; // demagnetization factor
float D; // diameter of pick up coil
float gx;
float gy;
double pi = 3.14;
float Go;
float Uo;
float loop_width;
float intercept;
float tip_height;
float Hc; // coercivity
float R;  // retentivity
float S;  // saturation magnetization
float ex;
float Eys;
float Eyr;

void inpSoftIron()
{
    cout << "Enter loop width: ";
    cin >> loop_width;

    cout << "Enter intercept: ";
    cin >> intercept;

    cout << "Enter tip to tip height: ";
    cin >> tip_height;
}

void inpHardIron()
{
    cout << "Enter loop width: ";
    cin >> loop_width;

    cout << "Enter intercept: ";
    cin >> intercept;

    cout << "Enter tip to tip height: ";
    cin >> tip_height;
}

void coercivity()
{
    cout << "Enter Go (for coercivity): ";
    cin >> Go;

    if (Area_Ratio == N)
    {
        cout << "Error: Division by zero in coercivity calculation!" << endl;
        return;
    }

    ex = (1.0f / 2.0f) * loop_width;
    Hc = (Go * ex) / (Area_Ratio - N);
    cout << "Coercivity (Hc) = " << Hc << endl;
}

void retentivity()
{
    cout << "Enter Go (for retentivity): ";
    cin >> Go;
    cout << "Enter Uo: ";
    cin >> Uo;

    if (gy == 0 || (Area_Ratio - N) == 0)
    {
        cout << "Error: Division by zero in retentivity calculation!" << endl;
        return;
    }

    Eyr = intercept;
    R = (Go * Uo * gx * Eyr) / (gy * (Area_Ratio - N) * 4 * pi);
    cout << "Retentivity (R) = " << R << endl;
}

void satMagnetization()
{
    cout << "Enter Go (for saturation magnetization): ";
    cin >> Go;
    cout << "Enter Uo: ";
    cin >> Uo;

    if (gy == 0 || (Area_Ratio - N) == 0)
    {
        cout << "Error: Division by zero in saturation magnetization calculation!" << endl;
        return;
    }

    Eys = (1.0f / 2.0f) * tip_height;
    S = (Go * Uo * gx * Eys) / (gy * (Area_Ratio - N) * 4 * pi);
    cout << "Saturation magnetization (S) = " << S << endl;
}

int main()
{
    printWelcomeMessage();

    cout << "<--- Exp-7 To study Hystresis loop for given ferromagnatic material on a CRO using solenoid---> " << endl;
    cout << "(All readings should be in mm)\n\n";

    cout << "Enter diameter of sample: ";
    cin >> d;

    cout << "Enter length of sample (l): ";
    cin >> l;

    cout << "Enter As: ";
    cin >> As;

    cout << "Enter Ac: ";
    cin >> Ac;

    if (Ac == 0)
    {
        cout << "Error: Ac cannot be zero." << endl;
        return -1;
    }

    Area_Ratio = As / Ac;
    cout << "Area Ratio(As/Ac) = " << Area_Ratio << endl;

    cout << "Enter demagnetization factor (N): ";
    cin >> N;

    cout << "Enter diameter of pick up coil: ";
    cin >> D;

    cout << "Enter gx: ";
    cin >> gx;

    cout << "Enter gy: ";
    cin >> gy;

    cout << "\nFor which iron do you want to find coercivity (Hc), retentivity (R) and saturation magnetization (S)?\nEnter 's' for soft iron and 'h' for hard iron, if not for anyone then type 'e' to end the program: ";
    char input;
    cin >> input;

    if (input == 's')
    {
        inpSoftIron();
        coercivity();
        retentivity();
        satMagnetization();
    }
    else if (input == 'h')
    {
        inpHardIron();
        coercivity();
        retentivity();
        satMagnetization();
    }
    else if (input == 'e')
    {
        printFinalMessage();
        return 0;
    }
    else
    {
        cout << "Invalid input!" << endl;
    }

    printFinalMessage();
    return 0;
}
