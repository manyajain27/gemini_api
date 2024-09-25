import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const api_key = "AIzaSyBcjLEPqGIKXhb5-jzen1TOqklDa1yt0AA";

const speakText = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.25;
    speechSynthesis.speak(utterance);
  };

async function generateResponse(formData) {
  const questionPrompt = `Create a list of 5 interview questions for a ${formData.position} job based on the skills: ${formData.skills} and experience: ${formData.experience}. Make the questions such that it tests the main technical knowledge of users on this mentioned topic and skills. It should be of beginner-intermediate level and should make the interviewee think. Display only the questions, which should be not be numbered, no instructions or titles for questions or other unnecessary info. Add a '$' symbol at the end of every question.`;

  const response = await axios({
    url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${api_key}`,
    method: 'post',
    data: {
      contents: [
        {
          parts: [
            { text: questionPrompt }
          ]
        }
      ]
    }
  });

  return response.data.candidates[0].content.parts[0].text;
}

async function getAnswerForQuestion(question) {
    const answerPrompt = `Answer the following interview question: "${question}". Provide a detailed but brief & concise response . just answer the question dont provide any additional info and titles and numbers.`;
  
    const response = await axios({
      url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${api_key}`,
      method: 'POST',
      data: {
        contents: [
          {
            parts: [
              { text: answerPrompt }
            ]
          }
        ]
      }
    });
  
    return response.data.candidates[0].content.parts[0].text;
  }

function GeminiResponse() {
  const location = useLocation();
  const { formData } = location.state;
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  

  useEffect(() => {
    const fetchQuestions = async () => {
    setLoading(true);
      const generatedQuestions = await generateResponse(formData);
      
      // Split the response by the '$' symbol and clean up any empty spaces
      const splitQuestions = generatedQuestions
        .split('$')
        .map(q => q.trim())
        .filter(q => q.length > 0); // Remove any empty entries
     
      setQuestions(splitQuestions);
      setLoading(false);
    };

    fetchQuestions();
  }, [formData]);

  const showAnswers = async (question, index) => {
    if (!answers[index]) {
      // Fetch answer only if it's not already fetched
      const answer = await getAnswerForQuestion(question);
      setAnswers(prevAnswers => ({
        ...prevAnswers,
        [index]: answer
      }));
    }
  };

  return (
    <div className='flex flex-col pt-4 justify-center items-center min-h-screen bg-green-200 pb-[100px] px-[15px]'>
      <div className="title mb-[30px] text-[30px] font-medium text-center">Welcome {formData.name}, lets begin our interview! </div>
      {loading ? (  // Show loading message or spinner while loading is true
        <div className="flex gap-[20px]">
            <svg className='animate-spin size-[50px]' stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M2 11H7V13H2zM17 11H22V13H17zM11 17H13V22H11zM11 2H13V7H11z"></path><path transform="rotate(-45.001 6.697 6.697)" d="M5.697 4.197H7.697V9.197H5.697z"></path><path transform="rotate(134.999 17.303 17.303)" d="M16.303 14.803H18.303V19.803H16.303z"></path><path transform="rotate(45.001 6.697 17.303)" d="M5.697 14.803H7.697V19.803H5.697z"></path><path transform="rotate(-44.992 17.303 6.697)" d="M14.803 5.697H19.803V7.697H14.803z"></path></svg>
        </div>
        ) :
        (<div className="grid grid-cols-1 gap-4 max-w-[600px]">
            {questions.map((question, index) => (
            <div key={index} className="bg-white p-4 rounded-lg shadow-lg">
                <h3 className="font-semibold mb-2">Question {index + 1}</h3>
                <p className="text-gray-700">{question}</p>
                <svg className='cursor-pointer scale-125 mt-2' onClick={() => speakText(question)} stroke="currentColor" fill="currentColor" stroke-width="0" version="1" viewBox="0 0 48 48" enable-background="new 0 0 48 48" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="#81D4FA" d="M28,7.1v2c7.3,1,13,7.3,13,14.9s-5.7,13.9-13,14.9v2c8.4-1,15-8.2,15-16.9S36.4,8.1,28,7.1z"></path><path fill="#546E7A" d="M14,32H7c-1.1,0-2-0.9-2-2V18c0-1.1,0.9-2,2-2h7V32z"></path><polygon fill="#78909C" points="26,42 14,32 14,16 26,6"></polygon><path fill="#03A9F4" d="M28,17.3v2.1c1.8,0.8,3,2.5,3,4.6s-1.2,3.8-3,4.6v2.1c2.9-0.9,5-3.5,5-6.7S30.9,18.2,28,17.3z"></path><path fill="#4FC3F7" d="M28,12.2v2c4.6,0.9,8,5,8,9.8s-3.4,8.9-8,9.8v2c5.7-1,10-5.9,10-11.8S33.7,13.1,28,12.2z"></path></svg>
                <div className="ans cursor-pointer text-blue-400" onClick={()=>showAnswers(question,index)}>View ideal answer</div>
                {answers[index] && (
                    <div className="mt-4 bg-gray-50 p-3 rounded-lg border">
                      <h4 className="font-semibold text-gray-800">Answer:</h4>
                      <p className="text-gray-600">{answers[index]}</p>
                    </div>
                  )}
            </div>
            ))}
      </div>)}
    </div>
  );
}

export default GeminiResponse;
