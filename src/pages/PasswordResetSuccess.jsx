import React, { useState, useEffect } from 'react';
import { CheckCircle, ArrowRight, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const PasswordResetSuccess = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setIsRedirecting(true);
          setTimeout(() => {
            navigate('/login');
          }, 500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <img 
            src="/brandLogo.png" 
            alt="Poing Admin" 
            className="w-16 h-16 mx-auto object-contain mb-4"
          />
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-600 to-green-700 rounded-xl flex items-center justify-center mb-4 shadow-lg">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Password Reset Successful!</h1>
          <p className="text-gray-600">Your password has been updated successfully</p>
        </div>

        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="text-center space-y-6">
            {/* Success Icon */}
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>

            {/* Success Message */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                All Set!
              </h2>
              <p className="text-gray-600">
                You can now sign in to your admin account with your new password.
              </p>
            </div>

            {/* Action Button */}
            {isRedirecting ? (
              <div className="inline-flex items-center justify-center gap-2 w-full bg-gradient-to-r from-[#0868A8] to-[#065a8a] text-white font-semibold py-3 px-4 rounded-lg">
                <Loader2 className="h-4 w-4 animate-spin" />
                Redirecting...
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-center text-sm text-gray-600">
                  Redirecting to login in {countdown} seconds...
                </div>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 w-full bg-gradient-to-r from-[#0868A8] to-[#065a8a] hover:from-[#065a8a] hover:to-[#054c75] text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Continue to Login Now
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Security Tips */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-center">
            <h3 className="text-sm font-medium text-blue-800 mb-2">
              Security Tips
            </h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Keep your password secure and don't share it</li>
              <li>• Use a unique password for your admin account</li>
              <li>• Consider using a password manager</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            © 2024 Poing Admin. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetSuccess;