import { Form, redirect, useActionData } from 'react-router-dom'
const Contact = () => {

  const data = useActionData();

  return (
    <div className="contact">
        <h>Contact Us</h>
  <Form method ="post" action="/help/contact">
    <label>
      <span>Your Email:</span>
      <input type="email" name="email" required />
    </label>
    <label>
      <span>Your message:</span>
      <textarea name="message" required ></textarea>
    </label>

    <button>Submit</button>
    
      {data && data.err && <p>{data.err}</p>}
  </Form>

    </div>
  )
}

export default Contact

export const contactAction = async ( {request} ) => {
  const data = await request.formData();

  const submission = {
    email: data.get('email'),
    message: data.get('message'),
  }

  // send post request

  if (submission.message.length < 10) {
    return {err: "Message must be over 10 chars long..."};
  }

  console.log(submission)
  // redirect the user
  return redirect('/')

}