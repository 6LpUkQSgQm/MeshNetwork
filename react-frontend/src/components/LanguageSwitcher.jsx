import React from "react";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();

  const handleChangeLanguage = (event) => {
    const selectedLanguage = event.target.value;
    i18n.changeLanguage(selectedLanguage);
  };

  return (
    <FormControl sx={{ minWidth: 150 }}>
      <InputLabel>{t("Language")}</InputLabel>
      <Select
        value={i18n.language}
        onChange={handleChangeLanguage}
        label={t("Language")}
      >
        <MenuItem value="en">English</MenuItem>
        <MenuItem value="fr">Français</MenuItem>
      </Select>
    </FormControl>
  );
};

export default LanguageSwitcher;