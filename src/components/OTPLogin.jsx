
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Phone, MessageSquare, Loader } from 'lucide-react';
import { uiActions, userActions } from '../redux/slices';
import Toast from './Toast';

const OTPLogin = () => {
  const [step, setStep] = useState('phone');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [otp, setOtp] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [countries, setCountries] = useState([]);

  const dispatch = useDispatch();
  const { toast } = useSelector((state) => state.ui);

  useEffect(() => {
    fetch('https://restcountries.com/v2/all?fields=name,callingCodes')
      .then((res) => res.json())
      .then((data) => {
        const formatted = data
          .filter((c) => c.callingCodes.length > 0)
          .map((c) => ({
            name: c.name,
            code: `+${c.callingCodes[0]}`,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        setCountries(formatted);
      })
      .catch(() => {
        dispatch(uiActions.setToast({ message: 'Failed to load countries', type: 'error' }));
      });
  }, []);

  const validatePhone = (phone) => /^[0-9]{10,}$/.test(phone);

  const handleSendOTP = () => {
    setErrors({});
    if (!validatePhone(phone)) {
      setErrors({ phone: 'Invalid phone number' });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('otp');
      dispatch(uiActions.setToast({ message: 'OTP sent!', type: 'success' }));
    }, 1000);
  };

  const handleVerifyOTP = () => {
    setErrors({});
    if (otp !== '123456') {
      setErrors({ otp: 'Incorrect OTP. Use 123456 for demo' });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      dispatch(userActions.setUser({ phone: `${countryCode}${phone}`, id: Date.now() }));
      dispatch(uiActions.setToast({ message: 'Login successful!', type: 'success' }));
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-blue-600 px-4">
      {toast && <Toast {...toast} onClose={() => dispatch(uiActions.clearToast())} />}
      <div className="bg-white shadow-xl rounded-3xl w-full max-w-md p-8 md:p-10 space-y-6 transition-all duration-300">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mx-auto flex items-center justify-center shadow-md">
            <MessageSquare className="text-white" size={30} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mt-4">Gemini Chat</h2>
          <p className="text-gray-500 text-sm">Sign in to continue</p>
        </div>

        {step === 'phone' ? (
          <div className="space-y-5">
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {countries.length === 0 ? (
                <option>Loading countries...</option>
              ) : (
                countries.map((c, i) => (
                  <option key={i} value={c.code}>
                    {c.name} ({c.code})
                  </option>
                ))
              )}
            </select>

            <div className="relative">
              <Phone className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="tel"
                placeholder="Enter phone number"
                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            <button
              onClick={handleSendOTP}
              disabled={loading}
              className={`w-full py-3 rounded-lg text-white font-semibold transition duration-300 ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
              }`}
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            <input
              type="text"
              maxLength={6}
              className="w-full px-4 py-3 border rounded-lg text-center tracking-widest text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            {errors.otp && <p className="text-red-500 text-sm">{errors.otp}</p>}

            <button
              onClick={handleVerifyOTP}
              disabled={loading}
              className={`w-full py-3 rounded-lg text-white font-semibold transition duration-300 ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
              }`}
            >
              {loading ? 'Verifying OTP...' : 'Verify OTP'}
            </button>

            <button
              onClick={() => setStep('phone')}
              className="text-sm text-purple-600 hover:underline w-full text-center"
            >
              ← Back to phone
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OTPLogin;
