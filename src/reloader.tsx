import React, { useState } from "react";
import { connecter } from "./Server/connecter";

const AddProductTypeForm: React.FC = () => {
  const [productType, setProductType] = useState("");
  const [label, setLabel] = useState("");
  const [valuesText, setValuesText] = useState(""); // valeurs en chaîne séparée par virgule
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
                        

    const values = valuesText
      .split(",")
      .map((v) => v.trim())
      .filter((v) => v.length > 0);

    if (!productType || !label || values.length === 0) {
      setMessage("Merci de remplir tous les champs et valeurs.");
      return;
    }

    try {
      const response = await connecter.post("db/api/parameters/type/", {
 productType, label, values },
      );

      const data = response.data

      if (response.status ==201) {
        setMessage("Succès : " + data.message);
        // reset form
        setProductType("");
        setLabel("");
        setValuesText("");
      } else {
        setMessage("Erreur : " + (data.error || "Erreur inconnue"));
      }
    } catch (error) {
      setMessage("Erreur réseau ou serveur.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Product Type :</label>
        <input
          type="text"
          value={productType}
          onChange={(e) => setProductType(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Label :</label>
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Values (séparés par des virgules) :</label>
        <input
          type="text"
          value={valuesText}
          onChange={(e) => setValuesText(e.target.value)}
          placeholder="ex: val1, val2, val3"
          required
        />
      </div>

      <button type="submit">Envoyer</button>

      {message && <p>{message}</p>}
    </form>
  );
};

export default AddProductTypeForm;
