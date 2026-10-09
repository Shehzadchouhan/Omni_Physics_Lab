#include <iostream>
#include <limits> // Include this header for std::numeric_limits
using namespace std;

int n;
double e = 1.6e-19;

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

void wavelength(float arr1[])
{
    cout << "Enter " << n << " values for wavelength if its in scientific notation (e.g., 3.14e2 = 3.14*10^2):" << endl;
    for (int i = 0; i < n; ++i)
    {
        cout << "L" << (i + 1) << ": ";
        cin >> arr1[i];
    }
}

void frequency(float arr1[])
{
    float sumF = 0.0; // Initialize sumF to 0

    cout << "Enter " << n << " values for frequency if its in scientific notation (e.g., 3.14e2 = 3.14*10^2):" << endl;
    for (int i = 0; i < n; ++i)
    {
        cout << "x" << (i + 1) << ": ";
        cin >> arr1[i];

        // Check for input failure
        while (cin.fail())
        {
            cin.clear();                                         // Clear the error flag
            cin.ignore(numeric_limits<streamsize>::max(), '\n'); // Discard invalid input
            cout << "Invalid input. Please enter a valid number in scientific notation for x" << (i + 1) << ": ";
            cin >> arr1[i];
        }

        sumF += arr1[i]; // Add the current value to sumF
    }

    cout << "Sum of x: " << sumF << endl;
}

void potGradient(float arr2[])
{
    float sumV = 0.0; // Initialize sumV to 0

    cout << "Enter " << n << " values for potential gradient if its in scientific notation (e.g., 3.14e2 = 3.14*10^2):" << endl;
    for (int i = 0; i < n; ++i)
    {
        cout << "y" << (i + 1) << ": ";
        cin >> arr2[i];

        sumV += arr2[i]; // Add the current value to sumV
    }

    cout << "Sum of y: " << sumV << endl;
}

void multiplyAndSum(float freq[], float grad[], float result[], float &sumResult)
{
    sumResult = 0.0;
    for (int i = 0; i < n; ++i)
    {
        result[i] = freq[i] * grad[i];
        sumResult += result[i];
    }
}

void squareFrequency(float freq[], float result[], float &sumResult)
{
    sumResult = 0.0; // Initialize sumResult to 0
    for (int i = 0; i < n; ++i)
    {
        result[i] = freq[i] * freq[i];
        sumResult += result[i];
    }
}

void calculateMandC(float freq[], float grad[], float &m, float &c)
{
    float sumX = 0.0, sumY = 0.0, sumXY = 0.0, sumX2 = 0.0;

    for (int i = 0; i < n; ++i)
    {
        sumX += freq[i];
        sumY += grad[i];
        sumXY += freq[i] * grad[i];
        sumX2 += freq[i] * freq[i];
    }

    m = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    c = (sumY * sumX2 - sumX * sumXY) / (n * sumX2 - sumX * sumX);
}

int main()
{

        printWelcomeMessage();

    cout<<"<---Exp-4 To find planck constant and work function by photoelectric effect--->"<<endl;
    cout<<("(All units should be in SI)\n");

    cout << "Enter noof readings for wavelength,frequency and potential gradient(n): ";
    cin >> n;

    float *wavelengthArr = new float[n];
    float *frequencyArr = new float[n];
    float *gradientArr = new float[n];
    float *resultArr = new float[n];
    float sumResult;

    wavelength(wavelengthArr);
    frequency(frequencyArr);
    potGradient(gradientArr);

    multiplyAndSum(frequencyArr, gradientArr, resultArr, sumResult);
cout<<"froquency*potential gradient(xy)"<<endl;
    for (int i = 0; i < n; ++i)
    {
        cout << "x" << (i + 1) << " * y" << (i + 1) << " = " << resultArr[i] << endl;
    }

    cout << "Sum of products: " << sumResult << endl;

    float sumSquareResult;
    squareFrequency(frequencyArr, resultArr, sumSquareResult);
cout<<"sqaure of frequency(x^2)"<<endl;
    for (int i = 0; i < n; ++i)
    {
        cout << "(x^2)" << (i + 1) << " = " << resultArr[i] << endl;
    }

    cout << "Sum of squares: " << sumSquareResult << endl;

    float m, c;
    calculateMandC(frequencyArr, gradientArr, m, c);

    cout << "Calculated m: " << m << endl;
    cout << "Calculated c: " << c << endl;
    float h = m * e; // planck constant
    float w=-c*1;//work function
    cout<<"\nPlanck constant(h)="<<h<<"j/s"<<endl;
    cout<<"Work function(w)="<<w<<"V"<<endl;
    delete[] wavelengthArr;
    delete[] frequencyArr;
    delete[] gradientArr;
    delete[] resultArr;
    printFinalMessage();

    return 0;
}
