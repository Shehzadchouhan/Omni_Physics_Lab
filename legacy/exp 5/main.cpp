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

int main()
{
    printWelcomeMessage();

    cout << "<--- Exp-To determine the Numerical Apperture of an optical fibre --->" << endl;

    cout << "(All readings should be in cm)\n\n";
    
    float avgD = 0.0;
    double theta;
    double NA;
    double in_Tan;
    double L;
    int n;
    
    cout << "Enter distance between screen and optical fibre(L) : ";
    cin >> L;
    cout << "How many readings of diameter: ";
    cin >> n;

    double D[n];  // Declare D after n is known
    
    for (int i = 0; i < n; i++)
    {
        cout << "D" << i+1 << ": ";
        cin >> D[i];
        avgD += D[i];
    }
    avgD /= n;  // Calculate the average
    
    cout << "Average Diameter (Diameter spot): " << avgD << " cm" << endl;

    in_Tan = avgD / (2 * L);
    cout << "Value of in_Tan: " << in_Tan << endl;

    theta = atan(in_Tan);
    cout << "Acceptance angle (theta): " << theta << endl;
    
     // Convert theta from radians to degrees
    double theta_in_degrees = theta * (180.0 / M_PI);
    cout << "Theta (in degrees): " << theta_in_degrees << endl;
    
    NA = sin(theta);
    cout << "Numerical Aperture (NA): " << NA << endl;

    printFinalMessage();

    return 0;
}
