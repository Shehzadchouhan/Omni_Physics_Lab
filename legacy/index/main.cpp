#include <iostream>
#include <iomanip>
#include <vector>
#include <string>

// Function declarations for each experiment
void experiment1();
void experiment2();
// Add more experiment function declarations as needed

void printWelcomeMessage()
{
    std::cout << "******************************************************" << std::endl;
    std::cout << "*                                                    *" << std::endl;
    std::cout << "*          Welcome to the Physics Experiments        *" << std::endl;
    std::cout << "*                Practical File Program              *" << std::endl;
    std::cout << "*                                                    *" << std::endl;
    std::cout << "******************************************************" << std::endl;
    std::cout << std::endl;
    std::cout << "This program simulates and demonstrates 8 different physics experiments." << std::endl;
    std::cout << "Each experiment will be executed sequentially, providing results and insights." << std::endl;
    std::cout << "Let's begin!" << std::endl;
    std::cout << std::endl;
}

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
    std::cout << "Your feedback is valuable to us. Please let us know your thoughts and suggestions on shehzadchouhan260@gmail.com" << std::endl;
    std::cout << "Thank you!" << std::endl;
}

void printIndex(const std::vector<std::string> &experiments)
{
    std::cout << "------------------------------------------------------" << std::endl;
    std::cout << "                  Experiment Index                   " << std::endl;
    std::cout << "------------------------------------------------------" << std::endl;
    std::cout << std::endl;
    for (size_t i = 0; i < experiments.size(); ++i)
    {
        std::cout << (i + 1) << ". " << experiments[i] << std::endl;
    }
    std::cout << std::endl;
}

int main()
{
    printWelcomeMessage();

    // List of experiment titles
    std::vector<std::string> experiments = {
        "Experiment 1: Exp-1 To measure the divegence of the laser beam",
        "Experiment 2: Exp-2 To find the dielectric constant of a solid sample",
        "Experiment 3: Exp-3 To find the diffraction using laser beam and determine its grating element",
        "Experiment 4: Exp-4 To find planck constant and work function by photoelectric effect",
        "Experiment 5: Exp-To determine the Numerical Apperture of an optical fibre",
        "Experiment 6: Exp-6 To determine the attenuation and propagation losses in optical fibre",
        "Experiment 7: Exp-7 To study Hystresis loop for given ferromagnatic material on a CRO using solenoid",
        "Experiment 8: Exp-8 To find the velocity of ultrasonic wave in a given liquid using ultrasonic interferrometer",
        // Add more experiment titles as needed
    };

    printIndex(experiments);

    printFinalMessage();
    return 0;
}
