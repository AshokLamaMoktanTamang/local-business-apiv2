export const emailVerificationTemplate = (
  fullName: string,
  tokenLink: string
) => {
  return `<div
      style="
        max-width: 500px;
        display: block;
        background: whitesmoke;
        border-radius: 0.35rem;
        border: 1px dashed #e0e0e0;
        font-family: sans-serif;
        overflow: hidden;
      "
      >
      <div style="padding: 1rem">
        <h3
          style="
            display: block;
            line-height: 1.7;
            margin: 0;
            font-family: inherit;
            color: #636363;
          "
        >
          Hello ${fullName}!
        </h3>
        <p
          style="
            display: block;
            margin: 0;
            line-height: 1.65;
            margin-bottom: 1.7rem;
            font-family: inherit;
            color: #747474;
            font-size: 0.85rem;
          "
        >
          You just registered to Local business directory application with this email. For
          the further verification please confirm that this email belongs to
          you. For the verification pleace click the button below.
        </p>
        <a
          href="${tokenLink}"
          style="
            display: block;
            margin: auto;
            width: fit-content;
            text-decoration: none;
            color: white;
            background-color: royalblue;
            padding: 0.5rem 0.7rem;
            border-radius: 0.35rem;
            font-size: 0.87rem;
            font-weight: bold;
          "
          >Verify Now</a
        >
      </div>
      
      <div
        style="
          margin-top: 1rem;
          background-color: darkslategray;
          padding: 0.5rem;
          color: white;
        "
      >
        <p
          style="
            display: block;
            margin: 0;
            line-height: 1.65;
            font-family: inherit;
            font-size: 0.85rem;
            margin-bottom: 1.5rem;
          "
        >
          Please don't reply to this email because there is no one looking at
          this email.
        </p>
        <p
          style="
            display: block;
            margin: 0;
            line-height: 1.65;
            font-family: inherit;
            font-size: 0.85rem;
          "
        >
          For the further detail contact us at:
        </p>
        <span
          style="
            display: block;
            margin: 0;
            line-height: 1.65;
            font-family: inherit;
            font-size: 0.85rem;
          "
          >support.codelearner@gmail.com</span
        >
        <span
          style="
            display: block;
            margin: 0;
            line-height: 1.65;
            font-family: inherit;
            font-size: 0.85rem;
          "
          >9840708606</span
        >
      </div>
      </div>`;
};
