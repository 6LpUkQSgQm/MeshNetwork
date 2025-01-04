import React from "react";
import { Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from "@mui/material";
import { useTranslation } from "react-i18next";

const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();

  const handleChangeLanguage = (event: SelectChangeEvent<string>) => {
    const selectedLanguage = event.target.value as string;
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