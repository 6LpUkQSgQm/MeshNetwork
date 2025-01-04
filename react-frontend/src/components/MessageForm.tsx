import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { TextField, Button } from "@mui/material";
import { FaPaperPlane } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useApi } from "../utils/api";
import { useAuth } from "../context/AuthContext";

interface MessageFormValues {
  content: string;
}

const MessageForm: React.FC = () => {
  const { sendMessage } = useApi();
  const { t } = useTranslation();
  const { token } = useAuth();
  const [isSending, setIsSending] = useState(false);

  const validationSchema = Yup.object({
    content: Yup.string()
      .required(t("Message content cannot be empty"))
      .min(3, t("Message is too short. Please enter more than 3 characters.")),
  });

  const handleSendMessage = async (
    values: MessageFormValues,
    { resetForm }: { resetForm: () => void }
  ) => {
    if (!token) {
      console.error("No token provided");
      return;
    }

    setIsSending(true);

    try {
      await sendMessage(token, values.content);
      resetForm();
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Formik
      initialValues={{ content: "" }}
      validationSchema={validationSchema}
      onSubmit={handleSendMessage}
    >
      {({ isSubmitting, errors, touched }) => (
        <Form>
          <Field
            name="content"
            as={TextField}
            label={t("Enter your message")}
            fullWidth
            margin="normal"
            variant="outlined"
            error={Boolean(touched.content && errors.content)}
            helperText={touched.content && errors.content}
          />
          <Button
            type="submit"
            variant="contained"
            color="success"
            fullWidth
            disabled={isSubmitting || isSending}
            sx={{ marginTop: 2 }}
          >
            {isSending ? t("Sending...") : t("Send")}
            <FaPaperPlane style={{ marginLeft: 8 }} />
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default MessageForm;