function transform(input) {
  const updated = new Date().toISOString();
  const projectCamera = (camera) => ({
    id: camera?.id,
    thumbnailUrl: camera?.thumbnailUrl,
    title: camera?.title,
    description: camera?.description
  });

  const cameras = (() => {
    if (Array.isArray(input)) return input;
    if (Array.isArray(input?.data)) return input.data;
    if (Array.isArray(input?.cameras)) return input.cameras;
    if (Array.isArray(input?.RoadwayCameras)) return input.RoadwayCameras;

    if (input && typeof input === 'object') {
      const list = Object.entries(input).find(([key, value]) => {
        if (key === 'trmnl') return false;
        return Array.isArray(value);
      });
      if (list) return list[1];
    }

    return [];
  })();

  const rawCameraIds =
    input?.trmnl?.plugin_settings?.custom_fields_values?.tdot_camera_ids
    ?? input?.plugin_settings?.custom_fields_values?.tdot_camera_ids
    ?? input?.custom_fields_values?.tdot_camera_ids
    ?? input?.tdot_camera_ids;
  const normalizedIds = String(rawCameraIds || '')
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean);

  if (normalizedIds.length === 0) {
    return { data: cameras.map(projectCamera), updated };
  }

  const allowedIds = new Set(normalizedIds);
  const filteredCameras = cameras.filter((camera) => {
    const cameraId = String(camera?.id ?? '').trim();
    return cameraId !== '' && allowedIds.has(cameraId);
  });

  return { data: filteredCameras.map(projectCamera), updated };
}
