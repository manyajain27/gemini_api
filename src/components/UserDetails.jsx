import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function UserDetails() {
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    skills: '',
    experience: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/gemini-response', { state: { formData } });
  };

  return (
    <div className='flex flex-col justify-center items-center min-h-screen bg-green-200'>
      <div className="title mb-[30px] lg:text-[30px] md:text-[30px] text-[20px] font-medium">Interview Questions Generator</div>
      <form onSubmit={handleSubmit} className='flex flex-col items-start px-[25px] bg-gray-100 p-[30px] rounded-xl'>
        <h1 className='mb-4 font-semibold text-2xl'>Enter your details</h1>

        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 lg:w-[500px] md:w-[450px] block w-[300px] border border-gray-300 rounded-md p-2"
            placeholder="Enter your name"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="position" className="block text-gray-700">Position:</label>
          <textarea
            id="position"
            name="position"
            value={formData.position}
            onChange={handleChange}
            className="mt-1 block md:w-[450px] lg:w-[500px] w-[300px] border border-gray-300 rounded-md p-2"
            placeholder="Enter the position you're applying for"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="skills" className="block text-gray-700">Main Skills:</label>
          <textarea
            id="skills"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            className="mt-1 block md:w-[450px] lg:w-[500px] w-[300px] border border-gray-300 rounded-md p-2"
            placeholder="What are your skills relevant to the interview?"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="experience" className="block text-gray-700">Experience:</label>
          <textarea
            id="experience"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            className="mt-1 block lg:w-[500px] md:w-[450px] w-[300px] border border-gray-300 rounded-md p-2"
            placeholder="What experience do you have?"
            required
          />
        </div>

        <button type="submit" className='border m-auto border-black rounded-3xl p-[10px] text-black hover:bg-black hover:text-white'>
          Generate Interview questions
        </button>
      </form>
    </div>
  );
}

export default UserDetails;
