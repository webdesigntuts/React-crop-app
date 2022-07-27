//STYLING
import "./App.css";
import { Box, Paper, Button, Title, Group, Slider, Stack } from "@mantine/core";
import { Text } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import {
  IconZoomIn,
  IconPhoto,
  IconRefresh,
  IconSlideshow,
  IconAlertCircle,
} from "@tabler/icons";

//REACT HOOKS
import { useState, useCallback, useEffect } from "react";

//COMPONENTS
import Cropper from "react-easy-crop";
import getCroppedImg from "./CropImage";
import CroppedImage from "./CroppedImage";

function App() {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);

  //FILE
  const [files, setFiles] = useState([]);
  const [imagePath, setImagePath] = useState(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(
        imagePath,
        croppedAreaPixels,
        rotation
      );
      setCroppedImage(croppedImage);
    } catch (e) {
      console.error(e);
    }
  }, [croppedAreaPixels, rotation]);

  useEffect(() => {
    if (files[0]) {
      setImagePath(URL.createObjectURL(files[0]));
    }
  }, [files]);

  return (
    <div className="App">
      <Title sx={{ marginBottom: "2rem", color: "black" }}>
        <Group>
          <Text>Image Cropper</Text>
          <IconPhoto size={47} />
        </Group>
      </Title>
      {imagePath && (
        <Paper shadow={"xl"} p="lg">
          <Group
            sx={{
              width: "70vw",
              height: "70vh",
              "@media (max-width: 855px)": {
                flexDirection: "column-reverse",
                minHeight: "700px",
              },
            }}
            noWrap
          >
            <Stack
              p={"lg"}
              sx={{
                width: "100%",
                height: "100%",
                outline: "1px solid gray",
                borderRadius: "10px",
                justifyContent: "center",
              }}
            >
              <Stack>
                <Stack>
                  <Group sx={{ gap: "0.3rem" }}>
                    <IconZoomIn size={20} />
                    <Text>Zoom Slider:</Text>
                  </Group>
                  <Slider
                    value={zoom}
                    onChange={setZoom}
                    min={1}
                    max={5}
                    step={0.05}
                    sx={{ width: "100%" }}
                  />
                </Stack>
                <Stack>
                  <Group sx={{ gap: "0.3rem" }}>
                    <IconRefresh size={20} />
                    <Text>Rotation Slider:</Text>
                  </Group>
                  <Slider
                    value={rotation}
                    onChange={setRotation}
                    min={-180}
                    max={180}
                    sx={{ width: "100%" }}
                  />
                </Stack>
                <Stack>
                  <Button
                    onClick={showCroppedImage}
                    sx={{ height: "auto" }}
                    p="sm"
                  >
                    <Group>
                      <IconSlideshow size={20} />
                      <Text>Show Image</Text>
                    </Group>
                  </Button>
                  <Button
                    onClick={() => {
                      setImagePath("");
                      setCroppedImage("");
                    }}
                    sx={{ height: "auto" }}
                    p="sm"
                  >
                    <Group>
                      <IconAlertCircle size={20} />
                      <Text>Clear Image</Text>
                    </Group>
                  </Button>
                </Stack>
              </Stack>
            </Stack>

            <Group
              p={"lg"}
              sx={{
                width: "100%",
                height: "100%",
                outline: "1px solid gray",
                position: "relative",
                justifyContent: "center",
                borderRadius: "10px",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                  position: "relative",
                }}
              >
                <Cropper
                  image={imagePath}
                  crop={crop}
                  rotation={rotation}
                  zoom={zoom}
                  aspect={4 / 3}
                  onCropChange={setCrop}
                  onRotationChange={setRotation}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                  objectFit="contain"
                  minZoom={1}
                  maxZoom={5}
                />
              </Box>
            </Group>
          </Group>
        </Paper>
      )}

      {croppedImage && (
        <CroppedImage img={croppedImage} setCloseImage={setCroppedImage} />
      )}

      {!imagePath && (
        <Dropzone
          accept={IMAGE_MIME_TYPE}
          onDrop={setFiles}
          sx={{
            width: "60vw",
            height: "200px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Group>
            <IconPhoto size={50} stroke={1.5} />
            <Text align="center">Drop images here</Text>
          </Group>
        </Dropzone>
      )}
    </div>
  );
}

export default App;
