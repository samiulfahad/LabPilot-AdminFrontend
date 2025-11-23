// src/SchemaBuilder.jsx
import React, { useState } from "react";

export default function SchemaBuilder() {
  const [title, setTitle] = useState("My Form");
  const [description, setDescription] = useState("");
  const [fields, setFields] = useState([]);
  const [expanded, setExpanded] = useState(new Set());
  const [copied, setCopied] = useState(false);

  const addField = (parentId) => {
    const newField = {
      id: Date.now() + Math.random(),
      name: "",
      type: "string",
      required: false,
      description: "",
      enum: [],
      minLength: "",
      maxLength: "",
      minimum: "",
      maximum: "",
      format: "",
      properties: undefined,
      items: undefined,
    };

    if (parentId) {
      setFields((prev) => addNested(prev, parentId, newField));
    } else {
      setFields((prev) => [...prev, newField]);
    }
  };

  const addNested = (fields, targetId, newField) =>
    fields.map((f) => {
      if (f.id === targetId) {
        if (f.type === "object") return { ...f, properties: [...(f.properties || []), newField] };
        if (f.type === "array") return { ...f, items: newField };
      }
      if (f.properties) return { ...f, properties: addNested(f.properties, targetId, newField) };
      return f;
    });

  const updateField = (id, updates) => {
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  const deleteField = (id) => setFields((prev) => prev.filter((f) => f.id !== id));

  const toggle = (id) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const build = (field) => {
    if (!field.name) return null;
    const s = { type: field.type };
    if (field.description) s.description = field.description;
    if (field.format) s.format = field.format;
    if (field.type === "string" && field.enum?.length) s.enum = field.enum;
    if (field.minLength !== "") s.minLength = Number(field.minLength);
    if (field.maxLength !== "") s.maxLength = Number(field.maxLength);
    if (field.minimum !== "") s.minimum = Number(field.minimum);
    if (field.maximum !== "") s.maximum = Number(field.maximum);
    if (field.type === "object" && field.properties) {
      const { props, req } = buildProps(field.properties);
      s.properties = props;
      if (req.length) s.required = req;
    }
    if (field.type === "array" && field.items) {
      s.items = build(field.items) || { type: "string" };
    }
    return s;
  };

  const buildProps = (fields) => {
    const props = {};
    const req = [];
    fields.forEach((f) => {
      const schema = build(f);
      if (schema && f.name) {
        props[f.name] = schema;
        if (f.required) req.push(f.name);
      }
    });
    return { props, req };
  };

  // This is the clean schema with title included
  const generateSchema = () => {
    const { props: properties, req: required } = buildProps(fields);
    const schema = {
      title: title.trim() || "Untitled Form",
      type: "object",
      properties,
    };
    if (description.trim()) schema.description = description.trim();
    if (required.length) schema.required = required;

    return JSON.stringify(schema, null, 2);
  };

  const copy = () => {
    navigator.clipboard.writeText(generateSchema());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderField = (f, depth = 0) => {
    const isObj = f.type === "object";
    const isArr = f.type === "array";
    const open = expanded.has(f.id);

    return (
      <div key={f.id} className={`${depth ? "ml-8 border-l-2 border-gray-300 pl-4" : ""} mb-4`}>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-start gap-3">
            {(isObj || isArr) && (
              <button onClick={() => toggle(f.id)} className="mt-1 text-xl font-bold text-gray-600">
                {open ? "−" : "+"}
              </button>
            )}
            {!isObj && !isArr && <div className="w-7" />}

            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <input
                  placeholder="field_name"
                  value={f.name}
                  onChange={(e) => updateField(f.id, { name: e.target.value })}
                  className="px-3 py-2 border rounded-md font-mono text-sm focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={f.type}
                  onChange={(e) => {
                    const t = e.target.value;
                    updateField(f.id, {
                      type: t,
                      properties: t === "object" ? [] : undefined,
                      items: t === "array" ? { id: Date.now(), name: "", type: "string" } : undefined,
                    });
                  }}
                  className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option>string</option>
                  <option>number</option>
                  <option>integer</option>
                  <option>boolean</option>
                  <option>object</option>
                  <option>array</option>
                  <option>null</option>
                </select>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={f.required}
                    onChange={(e) => updateField(f.id, { required: e.target.checked })}
                  />
                  required
                </label>
                <button onClick={() => deleteField(f.id)} className="text-red-600 text-2xl font-bold">
                  ×
                </button>
              </div>

              <input
                placeholder="Description (optional)"
                value={f.description}
                onChange={(e) => updateField(f.id, { description: e.target.value })}
                className="w-full px-3 py-2 border rounded-md text-sm"
              />

              {f.type === "string" && (
                <div className="flex flex-wrap gap-3 text-sm">
                  <input
                    placeholder="format (email, date...)"
                    value={f.format}
                    onChange={(e) => updateField(f.id, { format: e.target.value })}
                    className="px-3 py-2 border rounded-md"
                  />
                  <input
                    type="number"
                    placeholder="min"
                    value={f.minLength}
                    onChange={(e) => updateField(f.id, { minLength: e.target.value })}
                    className="px-3 py-2 border rounded-md w-24"
                  />
                  <input
                    type="number"
                    placeholder="max"
                    value={f.maxLength}
                    onChange={(e) => updateField(f.id, { maxLength: e.target.value })}
                    className="px-3 py-2 border rounded-md w-24"
                  />
                  <input
                    placeholder="enum: a,b,c"
                    onChange={(e) =>
                      updateField(f.id, {
                        enum: e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean),
                      })
                    }
                    className="flex-1 px-3 py-2 border rounded-md"
                  />
                </div>
              )}

              {["number", "integer"].includes(f.type) && (
                <div className="flex gap-3 text-sm">
                  <input
                    type="number"
                    placeholder="minimum"
                    value={f.minimum}
                    onChange={(e) => updateField(f.id, { minimum: e.target.value })}
                    className="px-3 py-2 border rounded-md w-32"
                  />
                  <input
                    type="number"
                    placeholder="maximum"
                    value={f.maximum}
                    onChange={(e) => updateField(f.id, { maximum: e.target.value })}
                    className="px-3 py-2 border rounded-md w-32"
                  />
                </div>
              )}
            </div>
          </div>

          {isObj && open && (
            <div className="mt-4">
              {f.properties?.map((n) => renderField(n, depth + 1))}
              <button onClick={() => addField(f.id)} className="ml-8 text-blue-600 text-sm font-medium">
                [+] Add property
              </button>
            </div>
          )}

          {isArr && open && f.items && (
            <div className="mt-4 ml-8">
              <div className="font-medium text-gray-600 mb-2">Array items:</div>
              {renderField(f.items, depth + 1)}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">JSON Schema Builder</h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Builder */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <input
              placeholder="Form title (will appear in schema)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-2xl font-bold mb-4 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              placeholder="Form description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full px-4 py-3 border rounded-lg mb-6 focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Fields</h3>
              <button onClick={() => addField()} className="px-5 py-3 bg-blue-600 text-white rounded-lg font-medium">
                [+] Add Field
              </button>
            </div>

            {fields.length === 0 ? (
              <div className="text-center py-16 text-gray-500 border-2 border-dashed rounded-xl">
                No fields yet — click [+] to start
              </div>
            ) : (
              fields.map(renderField)
            )}
          </div>

          {/* Preview */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Generated Schema</h2>
              <button
                onClick={copy}
                className={`px-5 py-3 rounded-lg font-medium ${copied ? "bg-green-600" : "bg-gray-800"} text-white`}
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <pre className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto text-sm font-mono">
              {generateSchema()}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
