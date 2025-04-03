// File path: src/pages/Login.tsx
import { useState } from 'react';
import Button from "../../Components/Button";
import Eye from '../../assets/icons/Eye';
import EyeOffIcon from '../../assets/icons/EyeOffIcon';
import bgImage from "../../assets/Images/Group 2506.png";
import { useNavigate } from 'react-router-dom';
import useApi from '../../Hooks/useApi';
import { endponits } from '../../Services/apiEndpoints';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

type Props = {}

function Login({ }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { request: login } = useApi("post", 7004);
  const { setIsAuthenticated } = useAuth();

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const url = `${endponits.LOGIN}`;
      const { response, error } = await login(url, { email, password });
      if (response?.data.success) {
        // Display success message and navigate to OTP
        toast.success('Login successful! Redirecting...');
        localStorage.setItem('authToken', response?.data.token);
        setIsAuthenticated(true); // Set authentication state
        // Redirect to the home/dashboard
        setTimeout(() => {
          navigate('/');
        }, 2000);
        // navigate("/otp", { state: { email } }); // Pass email via navigate state
      }
      else {
        toast.error(error.response.data.message);
        setError(error.response.data.message);
      }
    } catch (error) {
      const errorMessage = "Login failed. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="h-screen flex flex-col-reverse md:flex-row">
      {/* Left Side */}
      <div className="w-full md:w-1/2 flex justify-center items-center bg-white p-6 md:p-0">
        <div className="w-full max-w-md">
          <p className="text-textColor font-bold text-3xl md:text-4xl">Get Started now</p>
          <p className="text-dropdownText mt-2 text-sm font-normal">
            Enter your credentials to access your account
          </p>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="email" className="text-dropdownText text-sm">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-3 text-sm w-full rounded-md text-start mt-1.5 bg-white border border-inputBorder h-10 leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                  placeholder="Enter Email"
                />
              </div>
              <div>
                <label htmlFor="password" className="text-dropdownText text-sm">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-3 text-sm w-full rounded-md text-start mt-1.5 bg-white border border-inputBorder h-10 leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                    placeholder="Password"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="focus:outline-none mt-1"
                    >
                      {showPassword ? <Eye color="#4B5C79" /> : <EyeOffIcon color="#4B5C79" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex justify-center">
              <Button type="submit" className="w-full flex justify-center px-6 mt-7">
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full md:w-1/2 flex justify-center items-center bg-[#CACCBE] p-6 md:p-0">
        <div className="flex flex-col items-start justify-center w-full max-w-lg h-full p-4 md:p-8">
          <div className="text-center md:text-left md:ms-[14%]">
            <h2 className="text-textColor font-semibold text-2xl md:text-3xl leading-tight mt-6">
              Transform Your Financial <br className="hidden md:block" /> Management
            </h2>
            <p className="text-textColor mt-3 text-sm">
              Unlock powerful tools to keep your finances on track
            </p>
          </div>
          <img src={bgImage} alt="Dashboard preview" className="w-full" />
        </div>
      </div>
      <Toaster reverseOrder={false} />
    </div>
  )
}

export default Login;
