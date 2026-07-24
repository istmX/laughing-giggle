import os
import json
import csv
from typing import Dict, Any, List, Optional
from loguru import logger

BASE_KNOWLEDGE_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "knowledge", "ui")

class DesignKnowledgeEngine:
    def __init__(self):
        self._styles_cache = None
        self._colors_cache = None
        self._typography_cache = None
        self._motion_cache = None

    def _load_data(self, subfolder: str, catalog_json: str, fallback_csv: str) -> List[Dict[str, Any]]:
        # 1. Try JSON catalog inside subfolder
        json_path = os.path.join(BASE_KNOWLEDGE_DIR, subfolder, catalog_json)
        if os.path.exists(json_path):
            try:
                with open(json_path, mode='r', encoding='utf-8') as f:
                    return json.load(f)
            except Exception as e:
                logger.error(f"Error reading JSON catalog {json_path}: {e}")

        # 2. Try CSV file inside subfolder
        csv_path = os.path.join(BASE_KNOWLEDGE_DIR, subfolder, fallback_csv)
        if os.path.exists(csv_path):
            try:
                with open(csv_path, mode='r', encoding='utf-8') as f:
                    reader = csv.DictReader(f)
                    return list(reader)
            except Exception as e:
                logger.error(f"Error reading CSV {csv_path}: {e}")

        return []

    def get_styles(self) -> List[Dict[str, Any]]:
        if self._styles_cache is None:
            self._styles_cache = self._load_data("styles", "styles_catalog.json", "styles.csv")
        return self._styles_cache

    def get_colors(self) -> List[Dict[str, Any]]:
        if self._colors_cache is None:
            self._colors_cache = self._load_data("colors", "colors_catalog.json", "colors.csv")
        return self._colors_cache

    def get_typography(self) -> List[Dict[str, Any]]:
        if self._typography_cache is None:
            self._typography_cache = self._load_data("typography", "typography_catalog.json", "typography.csv")
        return self._typography_cache

    def get_motion(self) -> List[Dict[str, Any]]:
        if self._motion_cache is None:
            self._motion_cache = self._load_data("animations", "motion_catalog.json", "motion.csv")
        return self._motion_cache

    def search_design_context(self, query: str) -> str:
        if not query:
            return ""
        
        q_lower = query.lower()
        matched_styles = []
        matched_colors = []
        matched_typo = []
        matched_motion = []

        # Search Styles
        for row in self.get_styles():
            style_name = str(row.get("style_name") or row.get("name") or "").lower()
            keywords = str(row.get("keywords") or "").lower()
            desc = str(row.get("description") or "").lower()
            if any(term in q_lower for term in [style_name, keywords, desc] if term and len(term) > 3):
                matched_styles.append(row)
                if len(matched_styles) >= 2:
                    break

        # Search Colors
        for row in self.get_colors():
            palette_name = str(row.get("palette_name") or row.get("name") or "").lower()
            product = str(row.get("product_type") or row.get("category") or "").lower()
            if any(term in q_lower for term in [palette_name, product] if term and len(term) > 3):
                matched_colors.append(row)
                if len(matched_colors) >= 2:
                    break

        # Search Typography
        for row in self.get_typography():
            font_name = str(row.get("heading_font") or row.get("font_pairing") or "").lower()
            style = str(row.get("style") or row.get("category") or "").lower()
            if any(term in q_lower for term in [font_name, style] if term and len(term) > 3):
                matched_typo.append(row)
                if len(matched_typo) >= 2:
                    break

        # Search Motion
        for row in self.get_motion():
            trigger = str(row.get("trigger") or row.get("type") or "").lower()
            if trigger in q_lower or "animat" in q_lower or "scroll" in q_lower:
                matched_motion.append(row)
                if len(matched_motion) >= 2:
                    break

        context_parts = []
        if matched_styles:
            s = matched_styles[0]
            context_parts.append(f"Matching UI Style: {s.get('style_name', 'Style')} | Keywords: {s.get('keywords', '')}")
        if matched_colors:
            c = matched_colors[0]
            context_parts.append(f"Matching Color Palette: {c.get('palette_name', 'Palette')}")
        if matched_typo:
            t = matched_typo[0]
            context_parts.append(f"Matching Typography: {t.get('heading_font', '')} + {t.get('body_font', '')}")
        if matched_motion:
            m = matched_motion[0]
            context_parts.append(f"Matching GSAP Motion: {m.get('trigger', 'Scroll')} animation preset")

        return "\n".join(context_parts)

design_knowledge_engine = DesignKnowledgeEngine()
